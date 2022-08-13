import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Sidebar } from '../components/Sidebar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <div className="mainContent" style={{ padding: 8 }}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  )
}

export default MyApp
