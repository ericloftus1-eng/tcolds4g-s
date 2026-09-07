-- TCoLDS: Direct Messaging
-- Migration: 20260620190000_direct_messages.sql

-- ─── DIRECT MESSAGES TABLE ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast conversation lookups
CREATE INDEX IF NOT EXISTS idx_dm_sender ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_dm_recipient ON public.direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_dm_conversation ON public.direct_messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_dm_created ON public.direct_messages(created_at DESC);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Users can see messages they sent or received
CREATE POLICY "dm_select_own" ON public.direct_messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

-- Users can only insert messages as themselves
CREATE POLICY "dm_insert_own" ON public.direct_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can mark messages as read if they are the recipient
CREATE POLICY "dm_update_read" ON public.direct_messages
  FOR UPDATE USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ─── REAL-TIME ────────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- ─── DEMO SEED DATA ──────────────────────────────────────────────────────────
-- Seed only if demo users exist from previous migration

DO $$
DECLARE
  u1 UUID;
  u2 UUID;
  u3 UUID;
BEGIN
  SELECT id INTO u1 FROM public.user_profiles WHERE email = 'rev.cacklesworth@tcolds.church' LIMIT 1;
  SELECT id INTO u2 FROM public.user_profiles WHERE email = 'bishop.snortley@tcolds.church' LIMIT 1;
  SELECT id INTO u3 FROM public.user_profiles WHERE email = 'deacon.wheezington@tcolds.church' LIMIT 1;

  IF u1 IS NOT NULL AND u2 IS NOT NULL THEN
    INSERT INTO public.direct_messages (sender_id, recipient_id, body, is_read, created_at) VALUES
      (u2, u1, 'Bro your Sunday set was absolutely unhinged. I spit out my communion wine 😂', true, NOW() - INTERVAL '2 hours'),
      (u1, u2, 'Haha I was going off!! Did you see the Bishop in the front row losing it?', true, NOW() - INTERVAL '1 hour 50 minutes'),
      (u2, u1, 'That was ME losing it 💀 You roasted me by name three times', true, NOW() - INTERVAL '1 hour 45 minutes'),
      (u1, u2, 'You deserved every single one of them lmao', false, NOW() - INTERVAL '1 hour')
    ON CONFLICT DO NOTHING;
  END IF;

  IF u1 IS NOT NULL AND u3 IS NOT NULL THEN
    INSERT INTO public.direct_messages (sender_id, recipient_id, body, is_read, created_at) VALUES
      (u3, u1, 'Yo are you coming to the open mic Thursday?', false, NOW() - INTERVAL '30 minutes'),
      (u3, u1, 'I got a new bit about the collection plate I need to test', false, NOW() - INTERVAL '25 minutes')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
