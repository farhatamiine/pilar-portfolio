import './globals.css'

// Root layout is a passthrough — <html lang={locale}> is set in [locale]/layout.tsx
// so the correct language attribute is always present for encoding and accessibility.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
