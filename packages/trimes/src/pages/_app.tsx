import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import Script from 'next/script'
import NProgress from 'nprogress'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'swiper/css'
import { SWRConfig } from 'swr'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import fetchJson from '../lib/fetchJson'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: err => {
          console.error(err)
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="pt-20 min-h-[60vh]">
          <Component {...pageProps} />
        </div>
        <Script src="/chatra.js" />
        <Footer />
      </QueryClientProvider>
    </SWRConfig>
  )
}

export default MyApp
