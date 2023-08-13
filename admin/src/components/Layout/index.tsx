import {
  Layout as AntLayout,
  Breadcrumb,
  ConfigProvider,
  Skeleton,
  theme
} from 'antd'
import Head from 'next/head'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useDarkMode } from '~/context/darkMode'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const Layout: FC<{
  children: React.ReactNode
  title?: string
  loading?: boolean
  breadcrumbs?: { label: string; link?: string }[]
}> = ({ children, title, loading, breadcrumbs }) => {
  const [collapsed, setCollapsed] = useState(true)
  const { isDarkMode } = useDarkMode()

  return (
    <>
      {title ? (
        <Head>
          <title>{title}</title>
        </Head>
      ) : null}
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
      >
        <AntLayout hasSider>
          <Sidebar collapsed={collapsed} breadcrumbs={breadcrumbs} />
          <AntLayout
            className={`transition-all duration-300 ${
              collapsed ? 'md:ml-[80px]' : 'md:ml-[200px]'
            }`}
          >
            <Header
              sidebarCollapsed={collapsed}
              toggleSidebar={() => setCollapsed(prev => !prev)}
            />
            <AntLayout.Content
              className={`min-h-[calc(100dvh-110px)] px-2 md:px-4 lg:px-8`}
            >
              {breadcrumbs ? (
                <Breadcrumb
                  className="my-3"
                  items={breadcrumbs.map((b, i) => ({
                    key: i,
                    title: b.link ? (
                      <Link href={b.link}>{b.label}</Link>
                    ) : (
                      b.label
                    )
                  }))}
                />
              ) : null}
              {loading ? <Skeleton active /> : children}
            </AntLayout.Content>
          </AntLayout>
        </AntLayout>
      </ConfigProvider>
    </>
  )
}
