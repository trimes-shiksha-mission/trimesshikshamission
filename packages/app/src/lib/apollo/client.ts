import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import type { AppProps } from 'next/app'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import {
  NEXT_PUBLIC_AUTH_STATE_KEY,
  NEXT_PUBLIC_GRAPHQL_API_URL
} from '../config'
import { fetchRefreshToken } from '../fetchRefreshToken'
import type { IDefaultAuthState } from '../state/auth'

const getAuthState = () => {
  if (typeof window === 'undefined') return

  let authState: IDefaultAuthState | undefined

  try {
    let readData = localStorage.getItem(NEXT_PUBLIC_AUTH_STATE_KEY)
    if (readData) authState = JSON.parse(readData)
  } catch (err) {}

  return authState
}

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const createApolloClient = (
  setAuthState?: Dispatch<SetStateAction<IDefaultAuthState>>
) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: getAuthState()?.accessToken
      }
    }
  })

  const uploadLink = createUploadLink({
    uri: NEXT_PUBLIC_GRAPHQL_API_URL,
    fetch: (uri, options: any) => {
      if (typeof window === 'undefined') return fetch(uri, options)

      const authState = getAuthState()

      if (
        options &&
        options.headers &&
        options.headers.authorization &&
        authState?.expiresAt &&
        authState.expiresAt < Date.now() &&
        authState.refreshToken
      ) {
        return fetchRefreshToken(authState.refreshToken)
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
                profileImage,
                accessToken,
                refreshToken,
                issuedAt,
                expiresAt
              } = json.data.refreshToken
              const obj = {
                loggedIn: true,
                userId,
                role,
                email,
                phone,
                firstName,
                lastName,
                profileImage: profileImage || '',
                accessToken,
                refreshToken,
                issuedAt,
                expiresAt: expiresAt * 1000
              }
              setAuthState && setAuthState(obj)
              localStorage.setItem(
                NEXT_PUBLIC_AUTH_STATE_KEY,
                JSON.stringify(obj)
              )
              options.headers.authorization = accessToken
            }
            return fetch(uri, options)
          })
          .catch(err => {
            console.error('Failed to refresh token', err)
            return fetch(uri, options)
          })
      } else return fetch(uri, options)
    }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache()
  })
}

export const initializeApollo = (
  initialState: NormalizedCacheObject | null = null,
  setAuthState?: Dispatch<SetStateAction<IDefaultAuthState>>
) => {
  const _apolloClient = apolloClient ?? createApolloClient(setAuthState)

  if (initialState) {
    const existingCache = _apolloClient.extract()

    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s)))
      ]
    })

    _apolloClient.cache.restore(data)
  }

  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps']
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (
  pageProps: AppProps['pageProps'],
  setAuthState?: Dispatch<SetStateAction<IDefaultAuthState>>
) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(
    () => initializeApollo(state, setAuthState),
    [state, setAuthState]
  )
  return store
}
