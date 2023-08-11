import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import Script from 'next/script'
import NProgress from 'nprogress'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'swiper/css'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="pt-20 min-h-[60vh]">
        <Component {...pageProps} />
      </div>
      <Script src="/chatra.js" />
      <Footer />
    </QueryClientProvider>
  )
}

export default MyApp
