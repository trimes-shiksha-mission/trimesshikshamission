import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useApollo } from '../lib/apollo/client'
import { NEXT_PUBLIC_AUTH_STATE_KEY } from '../lib/config'
import { fetchRefreshToken } from '../lib/fetchRefreshToken'
import {
  AuthStateContext,
  defaultAuthState,
  IDefaultAuthState
} from '../lib/state/auth'
import '../styles/globals.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [authState, setAuthState] = useState<IDefaultAuthState>({
    ...defaultAuthState
  })

  useEffect(() => {
    let readData: any = null
    try {
      const read = localStorage.getItem(NEXT_PUBLIC_AUTH_STATE_KEY)
      if (read) readData = JSON.parse(read)
    } catch (err) {
      setLoading(false)
    }
    if (!readData) {
      setLoading(false)
      return
    }
    if (
      readData.loggedIn &&
      readData.userId &&
      readData.role &&
      readData.email &&
      readData.firstName &&
      readData.lastName &&
      readData.accessToken &&
      readData.issuedAt &&
      readData.expiresAt &&
      readData.expiresAt > Date.now() &&
      readData.refreshToken
    ) {
      const {
        userId,
        role,
        email,
        phone,
        firstName,
        lastName,
        accessToken,
        issuedAt,
        expiresAt,
        refreshToken
      } = readData
      setAuthState({
        loggedIn: true,
        userId,
        role,
        email,
        phone,
        firstName,
        lastName,
        accessToken,
        issuedAt,
        expiresAt,
        refreshToken
      })
      setLoading(false)
    } else {
      fetchRefreshToken(readData.refreshToken)
        .then(res => res.json())
        .then(json => {
          if (
            json &&
            json.data &&
            json.data.refreshToken &&
            json.data.refreshToken.accessToken
          ) {
            const {
              userId,
              role,
              email,
              phone,
              firstName,
              lastName,
              accessToken,
              issuedAt,
              expiresAt,
              refreshToken
            } = json.data.refreshToken
            const obj = {
              loggedIn: true,
              userId,
              role,
              email,
              phone,
              firstName,
              lastName,
              accessToken,
              issuedAt: issuedAt * 1000,
              expiresAt: expiresAt * 1000,
              refreshToken
            }
            setAuthState(obj)
            localStorage.setItem(
              NEXT_PUBLIC_AUTH_STATE_KEY,
              JSON.stringify(obj)
            )
          }
        })
        .catch(err => {
          console.error('Failed to refresh token', err)
          setError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])

  return (
    <AuthStateContext.Provider value={{ authState, setAuthState }}>
      <ApolloProvider client={useApollo(pageProps, setAuthState)}>
        <ToastContainer />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error</div>
        ) : (
          <Component {...pageProps} />
        )}
      </ApolloProvider>
    </AuthStateContext.Provider>
  )
}

export default App
