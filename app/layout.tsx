import type React from "react"
import type { Metadata } from "next"
import { Cairo, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CompactNavHeader from "@/components/compact-nav-header"
import { Toaster } from "sonner"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] , variable: '--font-en'})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-ar',
})

export const metadata: Metadata = {
  title: "Nubras POS - Tailoring Management System",
  description: "Complete POS system for tailoring businesses",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex h-screen flex-col overflow-hidden">
              <CompactNavHeader />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
            <Toaster position="top-right" closeButton richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
