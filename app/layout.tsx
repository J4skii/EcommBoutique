import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Monica's Bow Boutique - Handcrafted Faux Leather Bows | Durban, KZN",
    template: "%s | Monica's Bow Boutique",
  },
  description:
    "Beautiful handmade faux leather bows crafted with love by Monica in Durban, KwaZulu-Natal. Each piece is unique and perfect for any occasion. Custom orders available. Free shipping over R300.",
  keywords: [
    "handmade bows",
    "faux leather",
    "accessories",
    "Durban",
    "KwaZulu-Natal",
    "South Africa",
    "handcrafted",
    "custom bows",
    "Monica",
    "bow boutique",
    "hair accessories",
    "fashion accessories",
  ],
  authors: [{ name: "Monica's Bow Boutique" }],
  creator: "Monica's Bow Boutique",
  publisher: "Monica's Bow Boutique",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://monicasbows.co.za"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://monicasbows.co.za",
    title: "Monica's Bow Boutique - Handcrafted Faux Leather Bows",
    description: "Beautiful handmade faux leather bows crafted with love in Durban, KZN. Custom orders available.",
    siteName: "Monica's Bow Boutique",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Monica's Bow Boutique - Handcrafted Bows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monica's Bow Boutique - Handcrafted Faux Leather Bows",
    description: "Beautiful handmade faux leather bows crafted with love in Durban, KZN.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
