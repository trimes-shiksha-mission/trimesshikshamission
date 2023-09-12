import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { CgClose, CgMenuRightAlt } from 'react-icons/cg'
import { navLinks } from '~/data/navLinks'
import type { NavLinkChild, NavLinkSubChild } from '../../data/navLinks'

const checkRoute = (currRoute: string, link: string) => {
  return '/' + currRoute.split('/')[1] === link
}

export const Header: FC = () => {
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false)
  const router = useRouter()
  const currRoute = router.route
  const { data: session } = useSession()
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
              text-black  md:hidden mr-4`}
              size={32}
              onClick={() => setPhoneMenuOpen(true)}
            />
            <ul className="hidden md:flex items-center justify-center lg:mr-8">
              {navLinks.map((item, i) =>
                item.protected && !session?.user ? null : (
                  <li
                    key={i}
                    className={`opacity-95 relative cursor-pointer py-4 text-lg font-medium mx-4 ${
                      item.link && checkRoute(currRoute, item.link)
                        ? 'text-primary'
                        : 'text-gray-900'
                    } hover:text-primary transition-all duration-200 ${
                      item.children?.length ? 'group' : ''
                    }`}
                  >
                    {item.link ? (
                      <Link href={item.link} passHref>
                        {item.title}
                      </Link>
                    ) : (
                      <span>{item.title}</span>
                    )}

                    <div className="invisible group-hover:flex h-0 group-hover:h-auto overflow-y-hidden group-hover:overflow-y-visible  group-hover:visible opacity-0 transition-all duration-300 group-hover:opacity-100 top-full flex-col absolute right-1/2 rounded-lg translate-x-1/2 bg-white text-gray-800 shadow-lg w-80">
                      <ul className="py-4 px-4">
                        {item.children?.map((childItem, j) => (
                          <DropdownMenu key={j} item={childItem} />
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              )}
              <li
                className={`opacity-95 relative cursor-pointer py-4 text-lg font-medium mx-4 ${
                  checkRoute(currRoute, session?.user ? '/profile' : '/login')
                    ? 'text-primary'
                    : 'text-gray-900'
                } hover:text-primary transition-all duration-200`}
              >
                <Link href={session?.user ? '/profile' : '/login'} passHref>
                  {session?.user ? session?.user.name : 'Register/Login'}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <AnimatePresence>
          {phoneMenuOpen && (
            <motion.div
              className="md:hidden absolute top-0 left-0 overflow-x-auto w-screen h-screen bg-white py-2 px-4  items-end"
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
                    checkRoute(
                      currRoute,
                      session?.user?.id ? '/profile' : '/login'
                    )
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  <Link
                    href={session?.user?.id ? '/profile' : '/login'}
                    className="nav-link-item-mobile"
                    onClick={() => {
                      setPhoneMenuOpen(false)
                    }}
                  >
                    {session?.user?.id ? session?.user?.name : 'Register/Login'}
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

const DropdownMenu: FC<{ item: NavLinkChild }> = ({ item }) => {
  const [activeMenuChildren, setActiveMenuChildren] = useState<
    NavLinkSubChild[]
  >([])

  return (
    <li className="hover:bg-gray-200 animated rounded-md nav-link-item-child flex items-center px-2">
      {item.link ? (
        <Link
          href={item.link}
          className="py-3 flex text-md items-center leading-snug mx-2"
        >
          {item.title}
        </Link>
      ) : (
        <span className="py-3 flex text-md items-center leading-snug mx-2">
          {item.title}
        </span>
      )}
      <AnimatePresence>
        {activeMenuChildren.length ? (
          <motion.div
            initial={{
              x: '-10%',
              opacity: 0
            }}
            whileInView={{
              x: '0',
              opacity: 1
            }}
            transition={{
              duration: 0.3
            }}
            exit={{
              x: '-10%',
              opacity: 0
            }}
            className="absolute min-h-full w-full top-0 left-0 z-20 rounded-lg bg-white shadow-lg"
            onMouseLeave={() => setActiveMenuChildren([])}
          >
            <ul className="p-4">
              {activeMenuChildren.map((child, i) => (
                <li
                  key={i}
                  className="hover:bg-gray-200 animated rounded-md nav-link-item-sub-child flex items-center px-2"
                >
                  {child.link ? (
                    <Link
                      href={child.link}
                      className="py-3 flex items-center leading-snug mx-2 text-md"
                    >
                      {child.title}
                    </Link>
                  ) : (
                    <span className="py-3 flex items-center leading-snug mx-2 text-md">
                      {child.title}
                    </span>
                  )}
                  {child.link ? (
                    <Link
                      href={child.link}
                      className="flex flex-1 items-center justify-end"
                    >
                      <BsArrowRight
                        className="opacity-0 nav-link-item-sub-child-arrow animated -translate-x-2 text-black"
                        size="20"
                      />
                    </Link>
                  ) : (
                    <span className="flex flex-1 items-center justify-end">
                      <BsArrowRight
                        className="opacity-0 nav-link-item-sub-child-arrow animated -translate-x-2 text-black"
                        size="20"
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  )
}
