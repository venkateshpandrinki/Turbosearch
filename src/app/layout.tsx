import type { Metadata } from "next";

import "./globals.css";
import { Lexend } from "next/font/google";
const inter = Lexend({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Turbo Search",
  description: "AI powered search engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body
        className={`${inter.className} flex min-h-screen flex-col justify-between bg-[#0a0a0a]`}
      >
        {children}
      </body>
    </html>
  );
}
