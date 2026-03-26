import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'धनधारा - कमाएँ और साझा करें',
  description: 'आपका अपना सोशल मीडिया प्लेटफॉर्म जहाँ कंटेंट के साथ कमाई भी होती है।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <main className="flex-1 pb-20 md:pb-0 md:pt-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}