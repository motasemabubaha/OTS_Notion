import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OTS Project',
  description: 'Self-hosted Notion-like productivity system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
