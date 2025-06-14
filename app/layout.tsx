import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CompactNavHeader from "@/components/compact-nav-header"
import { Toaster } from "sonner"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nubras POS - Tailoring Management System",
  description: "Complete POS system for tailoring businesses",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex h-screen flex-col overflow-hidden">
              <CompactNavHeader />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
            <Toaster position="top-right" closeButton richColors  />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
