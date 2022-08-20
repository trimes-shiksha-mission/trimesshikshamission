import type { AppProps } from 'next/app'
import 'swiper/css'
import { Header } from '../components/Header'
import '../styles/globals.css'
import { Footer } from '../components/Footer'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className="pt-20">
        <Component {...pageProps} />
      </div>
      <Script src="/chatra.js" />
      <Footer />
    </>
  )
}

export default MyApp
