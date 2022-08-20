import type { AppProps } from 'next/app'
import 'swiper/css'
import { Header } from '../components/Header'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className="pt-20">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
