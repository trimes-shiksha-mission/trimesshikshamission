import { User } from '@prisma/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { filters } from './api/userfilters'

type UserWithMembers = User & {
  members?: User[]
  area?: {
    name: string
  }
}

const ViewAll: NextPage = () => {
  const { data: filters, isLoading: getFiltersLoading } = useQuery(
    'filters',
    async () => {
      const data = await fetch('/api/userfilters')
      return (await data.json()) as filters
    }
  )
  const queryPage = parseInt((useRouter().query.page as string) || '1')
  const [page, setPage] = useState(queryPage)
  const {
    data: userData,
    isLoading: getUsersLoading,
    refetch: refetchUsers
  } = useQuery([page], async () => {
    if (page === -1) return
    const data = await fetch('/api/allusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: page ? page : 1
      })
    })
    const { users, total } = (await data.json()) as {
      users: UserWithMembers[]
      total: number
    }
    return { users, total }
  })
  useEffect(() => {
    if (queryPage !== -1) {
      setPage(queryPage)
    }
  }, [page, queryPage])

  if (getUsersLoading) {
    return <div>Loading...</div>
  }
  let count = page > 1 ? page * 5 + 1 : 1

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Users</h2>
          </div>
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L5 5.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L5 5.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M5 4a6 6 0 50 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 5z"></path>
                </svg>
              </span>
              <input
                placeholder="Search"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sr. No.
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gautra
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Occupation
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Marital Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Family Head
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Relation with Head
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData?.users.map((user, index) => (
                    <>
                      <tr key={user.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            {/* <div className="flex-shrink-0 w-5 h-5">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-149479058377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                          />
                        </div> */}
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {count++}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.gautra}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.gender}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.area?.name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.qualification}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.occupation}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.maritalStatus}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.headId}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap"></p>
                        </td>
                      </tr>
                      {user.members?.map((member, index2) => (
                        <tr key={member.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              {/* <div className="flex-shrink-0 w-5 h-5">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-149479058377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                          />
                        </div> */}
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {count++}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.name}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.gautra}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.gender}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap"></p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.qualification}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.occupation}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.maritalStatus}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {user.name}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {member.relationWithHead}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing {(page - 1) * 5 + 1} to{' '}
                  {page >= parseInt(((userData?.total || 0) / 5 + 1).toString())
                    ? userData?.total
                    : (page - 1) * 5 + 5}{' '}
                  of {userData?.total} Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <Link
                    href={`${page <= 1 ? '#' : `/viewAll?page=${page - 1}`}`}
                    passHref
                  >
                    <a
                      className={`text-sm bg-primary hover:opacity-80  text-white font-semibold py-2 px-4 rounded-l ${
                        page <= 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }`}
                    >
                      Prev
                    </a>
                  </Link>
                  {userData?.total && userData?.total > 5 ? (
                    <Link
                      href={`${
                        page >=
                        parseInt(((userData?.total || 0) / 5 + 1).toString())
                          ? '#'
                          : `/viewAll?page=${page + 1}`
                      }`}
                      passHref
                    >
                      <a
                        className={`text-sm bg-primary hover:opacity-80 text-white font-semibold py-2 px-4 rounded-r ${
                          page >=
                          parseInt(((userData.total || 0) / 5 + 1).toString())
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }`}
                      >
                        Next
                      </a>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>Total: {userData?.total}</h2>
      {userData?.users.map((user, i) => (
        <div key={i} className="flex gap-2">
          <span>{i + 1 + (page > 1 ? (page - 1) * 5 : 0)}</span>
          <span>{user.name}</span>
        </div>
      ))}
      {/* {Array.from({
        length: (userData?.total || 0) / 5 + 1
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
      ))} */}
    </>
  )
}

export default ViewAll
