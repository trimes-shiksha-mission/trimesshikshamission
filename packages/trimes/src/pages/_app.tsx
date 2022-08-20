import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'swiper/css'
import { Header } from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient()
  return (
<<<<<<< HEAD
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="pt-20">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
=======
    <>
      <Header />
      <div className="pt-20">
        <Component {...pageProps} />
      </div>
      <Script src="/chatra.js" />
      <Footer />
    </>
>>>>>>> 0ddb84ca768bd9ee1795794af2f92ce5eea28cad
  )
}

export default MyApp
