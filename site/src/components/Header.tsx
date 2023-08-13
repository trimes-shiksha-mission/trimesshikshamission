import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { CgClose, CgMenuRightAlt } from 'react-icons/cg'
import useUser from '../lib/useUser'

const checkRoute = (currRoute: string, link: string) => {
  return '/' + currRoute.split('/')[1] === link
}

export const Header: FC = () => {
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false)
  const router = useRouter()
  const currRoute = router.route
  const { user } = useUser()
  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setPhoneMenuOpen(false)
    })
  }, [router])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', phoneMenuOpen)
  }, [phoneMenuOpen])

  return (
    <>
      <header
        id="header"
        className={`w-full block fixed z-50 animated transition-all duration-300 sm:px-8 bg-white backdrop-filter backdrop-blur-md text-black bg-transparent`}
      >
        <nav>
          <div className="flex justify-between items-center animated py-1 animate-fadeInDown ">
            <Link
              href="/"
              className="ml-2 lg:ml-4py-2 flex items-center text-base sm:text-xl "
            >
              <div className="w-16 mr-3">
                <Image
                  src="/logo.png"
                  alt=""
                  layout="responsive"
                  height={1}
                  width={1}
                />
              </div>
              <span className="font-semibold tracking-wide">
                Trimes Shiksha Mission
              </span>
            </Link>
            <CgMenuRightAlt
              className={`${phoneMenuOpen ? 'invisible' : 'visible'}
              text-black  lg:hidden mr-4`}
              size={32}
              onClick={() => setPhoneMenuOpen(true)}
            />
            <ul className="hidden lg:flex items-center justify-center lg:mr-8">
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 hover:text-primary transition-all duration-200 text-black`}
              >
                <Link href="/">HOME</Link>
                {checkRoute(currRoute, '/') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>

              {user?.id ? (
                <li
                  className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200  `}
                >
                  <Link href="/viewAll">View Members</Link>
                  {checkRoute(currRoute, '/viewAll') && (
                    <div
                      className={`bg-black w-full h-[2px] absolute mt-1`}
                    ></div>
                  )}
                </li>
              ) : null}

              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200  `}
              >
                <Link href={user?.id ? '/profile' : '/login'}>
                  {user?.id ? user.name : 'Register/Login'}
                </Link>
                {checkRoute(currRoute, user?.id ? '/profile' : '/login') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <AnimatePresence>
          {phoneMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-0 left-0 overflow-x-auto w-screen h-screen bg-white py-2 px-4  items-end"
              initial={{
                x: '100%',
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 0.95
              }}
              exit={{
                x: '100%',
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
            >
              <CgClose
                className="float-right"
                size={32}
                onClick={() => {
                  setPhoneMenuOpen(false)
                }}
              />
              <ul className="flex flex-col py-8 px-1 w-full">
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link
                    href={'/'}
                    className="nav-link-item-mobile"
                    onClick={() => {
                      setPhoneMenuOpen(false)
                    }}
                  >
                    Home
                  </Link>
                </li>

                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/viewAll')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link
                    href={'/viewAll'}
                    className="nav-link-item-mobile"
                    onClick={() => {
                      setPhoneMenuOpen(false)
                    }}
                  >
                    View Members
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, user?.id ? '/profile' : '/login')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link
                    href={user?.id ? '/profile' : '/login'}
                    className="nav-link-item-mobile"
                    onClick={() => {
                      setPhoneMenuOpen(false)
                    }}
                  >
                    {user?.id ? user?.name : 'Register/Login'}
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
