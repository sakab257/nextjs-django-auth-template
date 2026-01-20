import type { Metadata } from "next";
import { roboto } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Django + Next.js - Auth Template",
  description: "Un template préparé pour l'authentification Django + Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${roboto.className} antialiased h-screen w-full`}
      >
        {children}
      </body>
    </html>
  );
}
