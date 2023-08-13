import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { FC, useState } from 'react'
import useUser from '../lib/useUser'

export const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('1')

  const { user } = useUser()
  const adminRoutes = [
    (user?.role === 'ADMIN' || user?.role === 'SUPERUSER') &&
      ({
        ...{
          type: undefined as any,
          label: <Link href="/admins">Admins</Link>,
          key: '1-1'
        }
      } as any),
    {
      type: undefined as any,
      label: <Link href="/editors">Editors</Link>,
      key: '1-2'
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
        selectedKeys={[selectedKey]}
        mode="inline"
        onClick={e => {
          setSelectedKey(e.key)
        }}
        items={[
          {
            key: '1',
            type: undefined as any,
            label: 'Admin Users',

            children: adminRoutes
          },
          ...((user?.role === 'SUPERUSER' && [
            {
              key: '2',
              type: undefined as any,
              label: 'SUPER ADMIN',
              children: [
                {
                  type: undefined as any,
                  label: <Link href="/editorial">Mann ki Baat</Link>,
                  key: '2-1'
                }
              ]
            }
          ]) ||
            []),
          ...(((user?.role === 'ADMIN' || user?.role === 'SUPERUSER') && [
            {
              key: '3',
              label: <Link href={'/users'}>Users</Link>
            }
          ]) ||
            [])
        ]}
      />
    </Layout.Sider>
  )
}
