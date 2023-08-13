import { Button } from 'antd'
import Link from 'next/link'
import { FC } from 'react'
import { useMutation } from 'react-query'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'

export const Header: FC = () => {
  const { user, mutateUser } = useUser()
  const {
    mutateAsync: logout,
    isLoading: logoutLoading,
    data: logoutData
  } = useMutation(async () => await fetchJson('/api/logout'))
  return (
    <div
      style={{
        background: '#001529',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h1 style={{ color: 'white', margin: 0 }}>Trimes Shiksha Mission</h1>
      {user?.isLoggedIn ? (
        <Button
          type="primary"
          loading={logoutLoading}
          onClick={async () => {
            await logout()
            mutateUser(logoutData as any)
          }}
        >
          Logout
        </Button>
      ) : (
        <Button type="primary">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  )
}
