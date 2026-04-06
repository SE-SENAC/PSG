import type { Metadata } from "next";
import "./globals.css"
import { Providers } from "@/components/Providers";
import LayoutClient from "@/components/LayoutClient";

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
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>
          <LayoutClient>
            {children}
          </LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
