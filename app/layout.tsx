import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Jan-Erik's 40th Anniversary Casino",
  description: 'A special casino experience for Jan-Erik - Forty but still sexy!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

