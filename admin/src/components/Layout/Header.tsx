import {
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Space, theme } from 'antd'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FC } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useDarkMode } from '~/context/darkMode'

export const Header: FC<{ sidebarCollapsed: boolean; toggleSidebar: any }> = ({
  sidebarCollapsed,
  toggleSidebar
}) => {
  const { data: session } = useSession()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  let avatar = ''
  if (session?.user.name) {
    const split = session.user.name.split(' ')
    const f = split[0] ? split[0][0] : ''
    const l = split[1] ? split[1][0] : ''
    avatar = `${f}${l}`
  }

  return (
    <Layout.Header
      className="flex items-center justify-between gap-x-1 px-4"
      style={{ background: colorBgContainer, padding: 0 }}
    >
      <Space className="flex items-center">
        <Button
          className="hidden md:block"
          size="large"
          type="text"
          onClick={toggleSidebar}
          icon={
            sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
        />
        <h1>Trimes Shiksha Mission</h1>
      </Space>
      <Space>
        <Button
          type="text"
          size="large"
          onClick={toggleDarkMode}
          className="flex items-center justify-center"
          icon={isDarkMode ? <FiMoon /> : <FiSun />}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: 'Profile',
                label: <Link href="/profile">Profile</Link>
              },
              {
                key: 'Change Password',
                label: <Link href="/change-password">Change Password</Link>
              },
              {
                key: 'Sign Out',
                label: 'Sign Out',
                onClick: () =>
                  signOut().then(() => {
                    window.location.href = '/'
                  })
              }
            ]
          }}
          arrow={true}
        >
          <div className="flex h-full cursor-pointer items-center justify-center">
            <Avatar size={36} className="flex items-center justify-center">
              {avatar}
            </Avatar>
          </div>
        </Dropdown>
        <Button
          className="block md:hidden"
          size="large"
          type="text"
          onClick={toggleSidebar}
          icon={<MenuOutlined />}
        />
      </Space>
    </Layout.Header>
  )
}
