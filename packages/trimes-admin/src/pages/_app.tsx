import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import useUser from '../lib/useUser'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  const { user } = useUser()
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {user?.isLoggedIn ? <Sidebar /> : null}
      <div
        className="mainContent"
        style={{ padding: 8, ...(!user?.isLoggedIn && { margin: 0 }) }}
      >
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  )
}

export default MyApp
