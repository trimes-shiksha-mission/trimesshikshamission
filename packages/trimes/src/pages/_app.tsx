import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'swiper/css'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient()
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="pt-20">
          <Component {...pageProps} />
        </div>
        <Script src="/chatra.js" />
        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
