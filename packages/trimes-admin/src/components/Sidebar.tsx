import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { FC, useState } from 'react'
import useUser from '../lib/useUser'

export const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['1'])
  const handleSidebarChange = (e: any) => setSelectedKeys([e.key])
  const { user } = useUser()
  const adminRoutes = [
    (user?.role === 'ADMIN' || user?.role === 'SUPERUSER') &&
      ({
        ...{
          type: undefined as any,
          label: <Link href="/admins">Admins</Link>,
          key: '1-1',
          onClick: handleSidebarChange
        }
      } as any),
    {
      type: undefined as any,
      label: <Link href="/editors">Editors</Link>,
      key: '1-2',
      onClick: handleSidebarChange
    }
  ]
  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={val => setCollapsed(val)}
      className="no-scrollbar"
      width={240}
      style={{
        position: 'fixed',
        height: '100%',
        overflowY: 'scroll'
      }}
    >
      <Menu
        selectedKeys={selectedKeys}
        mode="inline"
        items={[
          {
            key: '1',
            type: undefined as any,
            label: 'Admin Users',
            onClick: handleSidebarChange,
            children: adminRoutes
          },
          ...((user?.role === 'SUPERUSER' && [
            {
              key: '2',
              type: undefined as any,
              label: 'SUPER ADMIN',
              onClick: handleSidebarChange,
              children: [
                {
                  type: undefined as any,
                  label: <Link href="/editorial">Mann ki Baat</Link>,
                  key: '2-1',
                  onClick: handleSidebarChange
                }
              ]
            }
          ]) ||
            []),
          ...(((user?.role === 'ADMIN' || user?.role === 'SUPERUSER') && [
            {
              key: '8',
              label: <Link href={'/users'}>Users</Link>,
              onClick: handleSidebarChange
            }
          ]) ||
            []),
          ...(((user?.role === 'ADMIN' || user?.role === 'SUPERUSER') && [
            {
              key: '3',
              type: undefined as any,
              label: 'Vidhya Pracharini',
              onClick: handleSidebarChange,
              children: [
                {
                  type: undefined as any,
                  label: <Link href="/schools">Schools</Link>,
                  key: '3-1',
                  onClick: handleSidebarChange
                }
              ]
            }
          ]) ||
            []),
          {
            key: '4',
            label: <Link href="/news">News</Link>,
            onClick: handleSidebarChange
          },
          {
            key: '5',
            label: <Link href="/student">Student Portal</Link>,
            onClick: handleSidebarChange
          },
          {
            key: '6',
            label: <Link href="/gyanganga">Gyan Ganga Manch</Link>,
            onClick: handleSidebarChange
          },
          {
            key: '7',
            label: <Link href="/samagri">Samagri</Link>,
            onClick: handleSidebarChange
          }
        ]}
      />
    </Layout.Sider>
  )
}
