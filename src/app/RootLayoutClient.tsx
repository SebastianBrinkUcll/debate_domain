'use client';

import Providers from '@/components/Providers';
import Navbar from './navbar';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar />
      {children}
    </Providers>
  );
} 