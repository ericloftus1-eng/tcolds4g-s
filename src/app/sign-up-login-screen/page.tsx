import React from 'react';
import AuthPageClient from './components/AuthPageClient';
import { Toaster } from 'sonner';

export default function SignUpLoginPage() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" richColors />
      <AuthPageClient />
    </>
  );
}