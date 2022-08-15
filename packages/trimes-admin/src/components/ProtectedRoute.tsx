import { FC } from 'react'
import useUser from '../lib/useUser'

export const ProtectedRoute: FC<{ children: any }> = ({ children }) => {
  const { user } = useUser({
    redirectTo: '/login'
  })
  return <div>{children}</div>
}
