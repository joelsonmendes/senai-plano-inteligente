import './globals.css';
import type { Metadata } from 'next';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'SENAI • Plano Inteligente',
  description: 'Gerador inteligente de Plano de Ensino por competências',
  manifest: '/manifest.webmanifest',
  themeColor: '#083d77'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body><PwaRegister />{children}</body>
    </html>
  );
}
