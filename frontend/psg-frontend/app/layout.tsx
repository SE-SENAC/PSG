import type { Metadata } from "next";
import { Toaster } from 'sonner';
import { Roboto } from "next/font/google";
import "./globals.css"
import { Providers } from "@/components/Providers";
import LayoutClient from "@/components/LayoutClient";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Senac - Sergipe | PSG",
  description: "Programa Senac de Gratuidade",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} light`} style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <Providers>
          <LayoutClient>
            {children}
          </LayoutClient>
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
