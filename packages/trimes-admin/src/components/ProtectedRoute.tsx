import { Role } from '@prisma/client'
import { FC, useEffect } from 'react'
import useUser from '../lib/useUser'

export const ProtectedRoute: FC<{ children: any; role?: Role }> = ({
  children,
  role
}) => {
  const { user } = useUser({
    redirectTo: '/login'
  })
  useEffect(() => {
    if (!user) return
    if (role && user.role !== role) {
      window.location.href = '/'
    }
  }, [role, user])
  return <div>{children}</div>
}
