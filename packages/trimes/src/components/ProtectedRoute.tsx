import Link from 'next/link'
import { FC, ReactNode } from 'react'
import useUser from '../lib/useUser'

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })

  if (!user?.id) {
    return (
      <>
        <div className="w-full text-center text-3xl mb-96 mt-20">
          Please
          <Link href="/login" className="text-sky-500 text-bold">
            Login
          </Link>
          to Website to access this feature.
        </div>
      </>
    )
  }

  return <>{children}</>
}
