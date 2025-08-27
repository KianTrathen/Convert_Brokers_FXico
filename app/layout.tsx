import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Convertico - CRO Websites That Turn FX Traffic Into Traders",
  description:
    "Built for retail FX. Educate. Attribute. Nudge. Convert. We deliver results or get your money back.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* GA4 (replace GA_MEASUREMENT_ID when you have it; safe to leave as-is meanwhile) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className={`${GeistSans.className} min-h-screen bg-brand-bg text-brand-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
