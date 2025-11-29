import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ToastProvider } from "@/lib/context/ToastContext";
import { MonadWalletProvider } from "@/lib/wallet/MonadWalletProvider";

export const metadata: Metadata = {
  title: "Montify - AI-Verified Dataset Marketplace on Monad",
  description: "Trade verified datasets with confidence. AI-powered quality scores, blockchain certification, and decentralized storage on Monad blockchain.",
  
  keywords: [
    "Monad blockchain",
    "dataset marketplace",
    "AI verification",
    "blockchain certification",
    "NFT certificates",
    "data quality",
    "machine learning datasets",
    "verified data",
    "decentralized storage"
  ].join(", "),
  
  authors: [{ name: "Montify Team" }],
  creator: "Montify",
  publisher: "Montify",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph (for social media sharing)
  openGraph: {
    title: "Montify - Certify Your Data on Monad",
    description: "The first AI-verified, blockchain-certified dataset marketplace. Trade datasets with provable quality on Monad blockchain.",
    url: "https://montify.vercel.app",
    siteName: "Montify",
    images: [
      {
        url: "https://montify.vercel.app/logo.jpg",
        width: 1200,
        height: 1200,
        alt: "Montify - AI-Verified Dataset Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary",
    title: "Montify - Certify Your Data on Monad",
    description: "AI-verified, blockchain-certified dataset marketplace on Monad blockchain",
    creator: "@montify_io",
    images: ["https://montify.vercel.app/logo.jpg"],
  },
  
  // Additional Meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // App-specific
  applicationName: "Montify",
  appleWebApp: {
    capable: true,
    title: "Montify",
    statusBarStyle: "black-translucent",
  },
  
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen w-full overflow-x-hidden">
        <MonadWalletProvider>
          <ToastProvider>
            <Navbar />
            <main className="relative w-full">{children}</main>
            <Footer />
          </ToastProvider>
        </MonadWalletProvider>
      </body>
    </html>
  );
}
