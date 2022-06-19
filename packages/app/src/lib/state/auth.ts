import { createContext, useContext } from 'react'

export interface IDefaultAuthState {
  loggedIn: boolean
  userId: string
  role: string
  email: string
  phone: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
  issuedAt: number
  expiresAt: number
}

export const defaultAuthState: IDefaultAuthState = {
  loggedIn: false,
  userId: '',
  role: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  accessToken: '',
  refreshToken: '',
  issuedAt: 0,
  expiresAt: 0
}

export const AuthStateContext = createContext({
  authState: { ...defaultAuthState },
  setAuthState: (obj: IDefaultAuthState) => console.log(obj)
})

export const useAuthState = () => useContext(AuthStateContext)
