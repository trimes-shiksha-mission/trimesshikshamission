import { User } from '@prisma/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { filters } from './api/userfilters'

const ViewAll: NextPage = () => {
  const { data: filters, isLoading: getFiltersLoading } = useQuery(
    'filters',
    async () => {
      const data = await fetch('/api/userfilters')
      return (await data.json()) as filters
    }
  )
  const page = useRouter().query.page as string

  const {
    data: userData,
    isLoading: getUsersLoading,
    refetch: refetchUsers
  } = useQuery('users', async () => {
    const data = await fetch('/api/allusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: page ? parseInt(page) : 1
      })
    })
    const { users, total } = (await data.json()) as {
      users: User[]
      total: number
    }
    return { users, total }
  })

  useEffect(() => {
    refetchUsers()
  }, [page, refetchUsers])

  if (getUsersLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>Total: {userData?.total}</h2>
      {userData?.users.map((user, i) => (
        <div key={i} className="flex gap-2">
          <span>
            {i + 1 + (parseInt(page) > 1 ? (parseInt(page) - 1) * 10 : 0)}
          </span>
          <span>{user.name}</span>
        </div>
      ))}
      {Array.from({
        length: (userData?.total || 0) / 10 + 1
      }).map((_, i) => (
        <Link href={`/viewAll?page=${i + 1}`} passHref key={i}>
          <a
            className={`mx-2 ${
              parseInt(page) === i + 1 || (!page && i + 1 === 1)
                ? 'font-bold'
                : ''
            }`}
          >
            {i + 1}
          </a>
        </Link>
      ))}
    </>
  )
}

export default ViewAll
