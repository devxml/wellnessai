import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WellnessAI — India\'s Personal Wellness Planner',
  description: 'AI-powered Diet, Skincare & Haircare plans built specifically for India — affordable, accessible, personalised.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
