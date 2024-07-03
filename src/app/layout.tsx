import type { Metadata } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pontus",
  description: "Control application for embedded aquarium sensors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Pontus</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body
        className={`bg-gradient-to-b from-blue-200 to-cyan-200 ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
