import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ruang Temu',
  description: 'Teman belajar, circle produktif, dan room online untuk mahasiswa dan remaja.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
