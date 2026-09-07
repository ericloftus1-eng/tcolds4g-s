-- TCoLDS: Real-time Notifications, Coin Transaction Ledger, Most Savage Heckler Award
-- Migration: 20260620182442_tcolds_realtime_features.sql

-- ─── 1. TYPES ────────────────────────────────────────────────────────────────

DROP TYPE IF EXISTS public.notification_type CASCADE;
CREATE TYPE public.notification_type AS ENUM (
  'blessing', 'coins', 'live', 'lottery', 'ordination', 'follow', 'election', 'system', 'heckler'
);

DROP TYPE IF EXISTS public.coin_tx_type CASCADE;
CREATE TYPE public.coin_tx_type AS ENUM (
  'tip', 'mint', 'earn', 'spend', 'bonus', 'election_reward', 'heckler_award'
);

DROP TYPE IF EXISTS public.heckler_nomination_status CASCADE;
CREATE TYPE public.heckler_nomination_status AS ENUM (
  'pending', 'approved', 'rejected'
);

-- ─── 2. CORE TABLES ──────────────────────────────────────────────────────────

-- User profiles (if not already created by auth migration)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  handle TEXT UNIQUE,
  avatar_url TEXT,
  rank TEXT DEFAULT 'Layperson',
  cc_balance INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  notification_type public.notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  color TEXT DEFAULT '#D4AF37',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Coin transaction ledger
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  tx_type public.coin_tx_type NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  from_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Heckler award weeks
CREATE TABLE IF NOT EXISTS public.heckler_award_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_label TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  winner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  winner_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Heckler nominations
CREATE TABLE IF NOT EXISTS public.heckler_nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL REFERENCES public.heckler_award_weeks(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  nominated_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  savage_quote TEXT NOT NULL,
  context TEXT,
  vote_count INTEGER NOT NULL DEFAULT 0,
  nomination_status public.heckler_nomination_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Heckler votes
CREATE TABLE IF NOT EXISTS public.heckler_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id UUID NOT NULL REFERENCES public.heckler_nominations(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  week_id UUID NOT NULL REFERENCES public.heckler_award_weeks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. INDEXES ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON public.coin_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heckler_nominations_week_id ON public.heckler_nominations(week_id);
CREATE INDEX IF NOT EXISTS idx_heckler_votes_nomination_id ON public.heckler_votes(nomination_id);
CREATE INDEX IF NOT EXISTS idx_heckler_votes_voter_week ON public.heckler_votes(voter_id, week_id);

-- Unique: one vote per voter per week
CREATE UNIQUE INDEX IF NOT EXISTS idx_heckler_votes_unique_voter_week
  ON public.heckler_votes(voter_id, week_id);

-- ─── 4. FUNCTIONS ────────────────────────────────────────────────────────────

-- Auto-update updated_at on user_profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Auto-create user_profiles on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Increment nomination vote count when a vote is cast
CREATE OR REPLACE FUNCTION public.handle_heckler_vote_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.heckler_nominations
  SET vote_count = vote_count + 1
  WHERE id = NEW.nomination_id;
  RETURN NEW;
END;
$$;

-- ─── 5. ENABLE RLS ───────────────────────────────────────────────────────────

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heckler_award_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heckler_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heckler_votes ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ─────────────────────────────────────────────────────────

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
  ON public.user_profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "public_read_user_profiles" ON public.user_profiles;
CREATE POLICY "public_read_user_profiles"
  ON public.user_profiles FOR SELECT TO public
  USING (true);

-- notifications
DROP POLICY IF EXISTS "users_manage_own_notifications" ON public.notifications;
CREATE POLICY "users_manage_own_notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- coin_transactions
DROP POLICY IF EXISTS "users_view_own_coin_transactions" ON public.coin_transactions;
CREATE POLICY "users_view_own_coin_transactions"
  ON public.coin_transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users_insert_own_coin_transactions" ON public.coin_transactions;
CREATE POLICY "users_insert_own_coin_transactions"
  ON public.coin_transactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- heckler_award_weeks (public read)
DROP POLICY IF EXISTS "public_read_heckler_weeks" ON public.heckler_award_weeks;
CREATE POLICY "public_read_heckler_weeks"
  ON public.heckler_award_weeks FOR SELECT TO public
  USING (true);

-- heckler_nominations (public read, auth write)
DROP POLICY IF EXISTS "public_read_heckler_nominations" ON public.heckler_nominations;
CREATE POLICY "public_read_heckler_nominations"
  ON public.heckler_nominations FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "auth_insert_heckler_nominations" ON public.heckler_nominations;
CREATE POLICY "auth_insert_heckler_nominations"
  ON public.heckler_nominations FOR INSERT TO authenticated
  WITH CHECK (nominated_by = auth.uid());

-- heckler_votes (public read, auth write own)
DROP POLICY IF EXISTS "public_read_heckler_votes" ON public.heckler_votes;
CREATE POLICY "public_read_heckler_votes"
  ON public.heckler_votes FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "auth_insert_heckler_votes" ON public.heckler_votes;
CREATE POLICY "auth_insert_heckler_votes"
  ON public.heckler_votes FOR INSERT TO authenticated
  WITH CHECK (voter_id = auth.uid());

DROP POLICY IF EXISTS "auth_delete_own_heckler_votes" ON public.heckler_votes;
CREATE POLICY "auth_delete_own_heckler_votes"
  ON public.heckler_votes FOR DELETE TO authenticated
  USING (voter_id = auth.uid());

-- ─── 7. TRIGGERS ─────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_user_profiles_updated ON public.user_profiles;
CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_heckler_vote_insert ON public.heckler_votes;
CREATE TRIGGER on_heckler_vote_insert
  AFTER INSERT ON public.heckler_votes
  FOR EACH ROW EXECUTE FUNCTION public.handle_heckler_vote_insert();

-- ─── 8. ENABLE REALTIME ──────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.heckler_nominations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.heckler_votes;

-- ─── 9. MOCK DATA ────────────────────────────────────────────────────────────

DO $$
DECLARE
  user1_uuid UUID := gen_random_uuid();
  user2_uuid UUID := gen_random_uuid();
  user3_uuid UUID := gen_random_uuid();
  week1_uuid UUID := gen_random_uuid();
  week2_uuid UUID := gen_random_uuid();
  nom1_uuid UUID := gen_random_uuid();
  nom2_uuid UUID := gen_random_uuid();
  nom3_uuid UUID := gen_random_uuid();
  nom4_uuid UUID := gen_random_uuid();
BEGIN
  -- Create demo auth users
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'rev.cacklesworth@tcolds.church', crypt('laughterday123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Rev. Cacklesworth', 'avatar_url', ''),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'bishop.snortley@tcolds.church', crypt('laughterday123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Bishop Snortley', 'avatar_url', ''),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (user3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'deacon.wheezington@tcolds.church', crypt('laughterday123', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Deacon Wheezington', 'avatar_url', ''),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
  ON CONFLICT (id) DO NOTHING;

  -- Update user profiles with handles, ranks, and balances (trigger creates them)
  UPDATE public.user_profiles SET handle = 'cacklesworth', rank = 'Reverend', cc_balance = 12400 WHERE id = user1_uuid;
  UPDATE public.user_profiles SET handle = 'snortley', rank = 'Bishop', cc_balance = 8750 WHERE id = user2_uuid;
  UPDATE public.user_profiles SET handle = 'wheezington', rank = 'Deacon', cc_balance = 3200 WHERE id = user3_uuid;

  -- Seed notifications for user1
  INSERT INTO public.notifications (user_id, notification_type, title, body, is_read, color, created_at) VALUES
    (user1_uuid, 'blessing', 'Bishop Snortley blessed your sermon', '"Thou Shalt Not Bomb" received a Holy Blessing.', false, '#D4AF37', now() - interval '2 minutes'),
    (user1_uuid, 'coins', 'You received 50 Cheddar Coins', 'The congregation tipped you 50 CC for your latest set.', false, '#D4AF37', now() - interval '14 minutes'),
    (user1_uuid, 'live', 'Mass starts in 30 minutes', 'Bishop Snortley is hosting Sunday Massacre Mass.', false, '#52B788', now() - interval '28 minutes'),
    (user1_uuid, 'election', 'Summer Elections are OPEN', 'Vote for the Patron Saint and the Groan Reaper before Sunday.', false, '#7B4EA0', now() - interval '1 hour'),
    (user1_uuid, 'ordination', 'Rank Up: You are now a Deacon!', 'Your congregation blessings crossed the threshold.', true, '#D4AF37', now() - interval '3 hours'),
    (user1_uuid, 'system', 'Soft Launch: Welcome to TCoLDS', 'You are among the first congregation members.', true, '#8A8070', now() - interval '1 day')
  ON CONFLICT (id) DO NOTHING;

  -- Seed coin transactions for user1
  INSERT INTO public.coin_transactions (user_id, tx_type, amount, balance_after, description, from_user_id, created_at) VALUES
    (user1_uuid, 'earn', 200, 12400, 'Sermon blessing bonus — "Thou Shalt Not Bomb"', null, now() - interval '5 minutes'),
    (user1_uuid, 'tip', 50, 12200, 'Tip from Bishop Snortley', user2_uuid, now() - interval '14 minutes'),
    (user1_uuid, 'earn', 100, 12150, 'Weekly active member bonus', null, now() - interval '2 days'),
    (user1_uuid, 'spend', -500, 12050, 'Minted Medium Cheddar coin', null, now() - interval '3 days'),
    (user1_uuid, 'tip', 75, 12550, 'Tip from Deacon Wheezington', user3_uuid, now() - interval '5 days'),
    (user1_uuid, 'bonus', 500, 12475, 'Holy Lottery participation reward', null, now() - interval '7 days'),
    (user1_uuid, 'earn', 150, 11975, 'Congregation growth milestone — 100 followers', null, now() - interval '10 days'),
    (user1_uuid, 'tip', 25, 11825, 'Tip from Bishop Snortley', user2_uuid, now() - interval '12 days')
  ON CONFLICT (id) DO NOTHING;

  -- Seed coin transactions for user2
  INSERT INTO public.coin_transactions (user_id, tx_type, amount, balance_after, description, from_user_id, created_at) VALUES
    (user2_uuid, 'earn', 300, 8750, 'Live Mass hosting reward', null, now() - interval '1 day'),
    (user2_uuid, 'tip', 100, 8450, 'Tip from Rev. Cacklesworth', user1_uuid, now() - interval '3 days'),
    (user2_uuid, 'spend', -5000, 8350, 'Minted Sharp Cheddar coin', null, now() - interval '14 days')
  ON CONFLICT (id) DO NOTHING;

  -- Seed heckler award weeks
  INSERT INTO public.heckler_award_weeks (id, week_label, week_start, week_end, is_active, winner_id, winner_quote) VALUES
    (week1_uuid, 'Week of June 16, 2026', '2026-06-16', '2026-06-22', true, null, null),
    (week2_uuid, 'Week of June 9, 2026', '2026-06-09', '2026-06-15', false, user2_uuid, 'Your set was so bad, the microphone filed a restraining order.')
  ON CONFLICT (id) DO NOTHING;

  -- Seed nominations for current week
  INSERT INTO public.heckler_nominations (id, week_id, nominee_id, nominated_by, savage_quote, context, vote_count, nomination_status) VALUES
    (nom1_uuid, week1_uuid, user2_uuid, user1_uuid,
     'Your punchline arrived three business days after the setup. We filed a missing persons report.',
     'During the Sunday Massacre open mic, Bishop Snortley attempted a callback that nobody remembered.',
     47, 'approved'),
    (nom2_uuid, week1_uuid, user3_uuid, user2_uuid,
     'He heckled the heckler. The heckler cried. The congregation gave a standing ovation.',
     'Deacon Wheezington interrupted a roast to roast the roaster. Absolute chaos.',
     38, 'approved'),
    (nom3_uuid, week1_uuid, user1_uuid, user3_uuid,
     'Told a joke so dark it came with a trigger warning and a therapy hotline.',
     'Rev. Cacklesworth went full unhinged during the Wednesday sermon. No survivors.',
     29, 'approved'),
    (nom4_uuid, week1_uuid, user2_uuid, user3_uuid,
     'Asked the audience if they were having fun. They were not. He continued anyway.',
     'The crowd was silent. He took that as encouragement.',
     12, 'pending')
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
