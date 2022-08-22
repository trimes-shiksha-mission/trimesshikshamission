import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession()

  if (!session?.user?.id) {
    return (
      <>
        <div className="w-full text-center text-3xl mb-96 mt-20">
          Please
          <Link href="/login">
            <a className="text-sky-500 text-bold"> Login </a>
          </Link>
          to Website to access this feature.
        </div>
      </>
    )
  }

  return <>{children}</>
}
