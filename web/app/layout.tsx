import type { Metadata } from "next";
import { Web3Provider } from "@/context/Web3Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arciden",
  description: "Decentralized social media on Arc testnet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}