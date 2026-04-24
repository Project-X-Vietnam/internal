import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to the Crew | xOS',
  description: 'A place for people, not just profiles. Explore the real Project X crew.',
};

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
