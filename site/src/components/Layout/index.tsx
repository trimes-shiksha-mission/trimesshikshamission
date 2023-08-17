import { FC, ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout: FC<{ children: ReactNode; loading?: boolean }> = ({
  children,
  loading
}) => {
  return (
    <>
      <Header />
      {loading ? (
        <div className="z-[100] h-screen w-screen flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <main className="pt-24">{children}</main>
      )}
      <Footer />
    </>
  )
}
