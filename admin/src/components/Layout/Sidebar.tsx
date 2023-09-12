import { Layout, Menu } from 'antd'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BsImages, BsPencilSquare } from 'react-icons/bs'
import { FaUserShield } from 'react-icons/fa'
import { FaUserPen, FaUsersGear, FaUsersLine } from 'react-icons/fa6'
import { useDarkMode } from '~/context/darkMode'

export const Sidebar: FC<{
  collapsed: boolean
  breadcrumbs?: { label: string; link?: string }[]
}> = ({ collapsed, breadcrumbs }) => {
  const { data: sessionData } = useSession()
  const [collapsedWidth, setCollapsedWidth] = useState(80)
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    const fn = () => setCollapsedWidth(window.innerWidth >= 768 ? 80 : 0)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <Layout.Sider
      style={{
        position: 'fixed',
        zIndex: 1000,
        overflow: 'auto',
        height: '100dvh'
      }}
      trigger={null}
      collapsible
      breakpoint="md"
      collapsedWidth={collapsedWidth}
      collapsed={collapsed}
      theme={isDarkMode ? 'light' : 'dark'}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={
          breadcrumbs?.length && breadcrumbs[breadcrumbs.length - 1]?.label
            ? [breadcrumbs[breadcrumbs.length - 1]?.label!]
            : []
        }
        theme={isDarkMode ? 'light' : 'dark'}
        items={[
          ...(sessionData?.user?.role === 'SUPERUSER'
            ? [
              {
                key: '1',
                label: 'SUPER ADMIN',
                icon: <FaUserShield />,
                children: [
                  {
                    label: <Link href="/editorial">Mann ki Baat</Link>,
                    key: '2-1',
                    icon: <BsPencilSquare />
                  },
                  {
                    label: <Link href="/home-banner">Home Banner</Link>,
                    key: '2-2',
                    icon: <BsImages />
                  }
                ]
              },
              {
                label: <Link href="/admins">Admins</Link>,
                key: '2',
                icon: <FaUsersGear />
              }
            ]
            : []),
          ...(['ADMIN', 'SUPERUSER'].includes(sessionData?.user.role || '')
            ? [
              {
                label: <Link href="/editors">Editors</Link>,
                key: '3',
                icon: <FaUserPen />
              },
              {
                key: '4',
                label: <Link href={'/users'}>Users</Link>,
                icon: <FaUsersLine />
              },
              {
                label: 'त्रिमेस शिक्षा मिशन',
                key: '5',
                children: [
                  {
                    label: <Link href={'/tsm/vidhya-pracharini'}>त्रिमेस विद्या प्रचारिणी संस्थान</Link>,
                    key: '5-1',
                  },
                  {
                    label: <Link href={'/tsm/gyan-ganga'}>ज्ञान-गंगा मंच</Link>,
                    key: '5-2'
                  }
                ]
              },
              {
                label: <Link href={'/employment-news'}>Employment News</Link>,
                key: '6'
              },
              {
                label: <Link href={'/advertisements'}>Advertisements</Link>,
                key: '7'
              }
            ]
            : []),
          {
            label: 'Social Activities',
            key: '8',
            children: [
              ...(['SUPERUSER', 'ADMIN'].includes(sessionData?.user.role || '') ? [{
                label: <Link href={'/social-activities/institutions'}>पंजीकृत संस्थाएं</Link>,
                key: '8-1'
              }] : []),
              {
                label: <Link href={'/social-activities/areas'}>चोखलों से</Link>,
                key: '8-2'
              }
            ]
          },

        ]}
      />
    </Layout.Sider>
  )
}
