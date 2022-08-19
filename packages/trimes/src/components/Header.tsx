import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { CgClose, CgMenuRightAlt } from 'react-icons/cg'

const checkRoute = (currRoute: string, link: string) => {
  return '/' + currRoute.split('/')[1] === link
}

export const Header: FC = () => {
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false)
  const router = useRouter()
  const currRoute = router.route
  // const dark = currRoute === '/' ? false : true
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setPhoneMenuOpen(false)
    })
  }, [router])

  return (
    <>
      <header
        id="header"
        className={`w-full block fixed z-50 animated transition-all duration-300 sm:px-8 bg-white backdrop-filter backdrop-blur-md ${
          scroll ? 'text-black' : 'text-white'
        }bg-transparent`}
      >
        <nav>
          <div className="flex justify-between items-center animated py-1 animate-fadeInDown ">
            <Link href="/" passHref>
              <a className="ml-2 lg:ml-4 w-32">
                <Image
                  src="/logo.png"
                  alt=""
                  // layout="responsive"
                  height={50}
                  width={50}
                />
              </a>
            </Link>
            <CgMenuRightAlt
              className={`${phoneMenuOpen ? 'invisible' : 'visible'}
              ${
                scroll ? 'text-black' : 'text-white'
              } text-black  md:hidden mr-4`}
              size={32}
              onClick={() => setPhoneMenuOpen(true)}
            />
            <ul className="hidden md:flex items-center justify-center lg:mr-8">
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/" passHref>
                  <a>HOME</a>
                </Link>
                {checkRoute(currRoute, '/') 
               c
                }
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/matrimonial" passHref>
                  <a>MATRIMONIAL</a>
                </Link>
                {checkRoute(currRoute, '/matrimonial') 
                && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )
                }
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/news" passHref>
                  <a>NEWS</a>
                </Link>
                {checkRoute(currRoute, '/news') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/ec" passHref>
                  <a>CHOKHLE</a>
                </Link>
                {checkRoute(currRoute, '/ec') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/samagri" passHref>
                  <a>SAMAGRI</a>
                </Link>
                {checkRoute(currRoute, '/samagri') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200${
                  scroll ? 'text-black' : 'text-white'
                }`}
              >
                <Link href="/gyanganga" passHref>
                  <a>GYAN GANGA</a>
                </Link>
                {checkRoute(currRoute, '/gyanganga') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/students" passHref>
                  <a>STUDNETS CORNER</a>
                </Link>
                {checkRoute(currRoute, '/students') && (
                  <div
                    className={`bg-black w-full h-[2px] absolute mt-1`}
                  ></div>
                )}
              </li>
              <li
                className={`opacity-95 relative cursor-pointer py-2 text-base font-medium mx-4 text-black hover:text-primary transition-all duration-200
                ${scroll ? 'text-black' : 'text-white'}`}
              >
                <Link href="/jobs" passHref>
                  <a>JOBS PORTAL</a>
                </Link>
                {checkRoute(currRoute, '/jobs') && (
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
              className="md:hidden absolute top-0 left-0 w-screen h-screen bg-white py-2 px-4 flex flex-col items-end"
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
                size="32"
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
                  <Link href={'/'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/matrimonial')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/matrimonial'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      MATRIMONIAL
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/news')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/news'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      NEWS
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/ec')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/ec'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      CHOKHLA
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/samagri')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/samagri'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      SAMAGRI
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/gyanganga')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/gyanganga'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      GYAN GANGA
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/students')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/students'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      STUDENTS
                    </a>
                  </Link>
                </li>
                <li
                  className={`relative text-2xl w-full font-bold px-4 text-center py-4 animated hover:text-primary ${
                    checkRoute(currRoute, '/jobs')
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link href={'/jobs'} passHref>
                    <a
                      className="nav-link-item-mobile"
                      onClick={() => {
                        setPhoneMenuOpen(false)
                      }}
                    >
                      JOBS
                    </a>
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
