import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { FC, useState } from 'react'

export const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['1'])
  const handleSidebarChange = (e: any) => setSelectedKeys([e.key])

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
            children: [
              {
                type: undefined as any,
                label: <Link href="/admins">Admins</Link>,
                key: '1-1',
                onClick: handleSidebarChange
              },
              {
                type: undefined as any,
                label: <Link href="/editors">Editors</Link>,
                key: '1-2',
                onClick: handleSidebarChange
              }
            ]
          }
        ]}
      />
    </Layout.Sider>
  )
}
