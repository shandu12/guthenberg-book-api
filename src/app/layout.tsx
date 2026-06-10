import type { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreProvider';
import './globals.css';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';

export const metadata: Metadata = {
  title: 'Libreria Digitale',
  description: 'La tua libreria digitale personale',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <StoreProvider>
          <Header />
          <div className="min-h-[65vh] bg-transparent">
            {children}
          </div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
