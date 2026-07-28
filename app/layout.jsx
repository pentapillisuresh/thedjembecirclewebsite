import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900']
})

export const metadata = {
  title: 'The Djembe Circle – Official Drum Event Booking',
  description: 'Book your spot at the most electrifying drum circles and events. Join the rhythm today!',
  keywords: 'drum circle, event booking, djembe, percussion, music events',
  openGraph: {
    title: 'The Djembe Circle',
    description: 'Official drum event booking system',
    url: 'https://thedjembecircle.com',
    siteName: 'The Djembe Circle',
    images: [{ url: '/images/og-image.jpg' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}