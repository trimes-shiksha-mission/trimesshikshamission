import { User } from '@prisma/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5'
import { useQuery } from 'react-query'
import { Modal } from '../components/Modal'
import { filters } from './api/userfilters'

type UserWithMembers = User & {
  members?: User[]
  area?: {
    name: string
  }
}
const pageSize = 10
const ViewAll: NextPage = () => {
  const { data: filters, isLoading: getFiltersLoading } = useQuery(
    'filters',
    async () => {
      const data = await fetch('/api/userfilters')
      return (await data.json()) as filters
    }
  )
  const [membersModal, setMembersModal] = useState<UserWithMembers>()
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
    const { heads, totalHeads, totalUsers } = (await data.json()) as {
      heads: UserWithMembers[]
      totalHeads: number
      totalUsers: number
    }
    return { heads, totalHeads, totalUsers }
  })
  useEffect(() => {
    if (queryPage !== -1) {
      setPage(queryPage)
    }
  }, [page, queryPage])

  if (getUsersLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Users</h2>
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
                      View Members
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData?.heads?.map((user, index) => (
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
                              {/* calculate sr. no. according to page */}
                              {index + 1 + (page - 1) * 10}
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
                        <button
                          onClick={() => setMembersModal(user)}
                          className={`${
                            user.members?.length === 0
                              ? 'cursor-not-allowed text-gray-500'
                              : 'text-blue-500'
                          } flex items-center justify-center gap-1 bg-white border border-blue-500 rounded-md px-2 py-1 whitespace-no-wrap`}
                          disabled={user.members?.length === 0}
                        >
                          <span>{user.members?.length}&nbsp;View</span>{' '}
                          <IoEyeOutline />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
            <span className="text-xs xs:text-sm text-gray-900">
              Showing {(page - 1) * pageSize + 1} to{' '}
              {page >=
              parseInt(((userData?.totalHeads || 0) / pageSize + 1).toString())
                ? userData?.totalHeads
                : (page - 1) * pageSize + pageSize}{' '}
              of {userData?.totalHeads} Head Members
              <br />
              Total Users (including members): {userData?.totalUsers}
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
              {userData?.totalHeads && userData?.totalHeads > pageSize ? (
                <Link
                  href={`${
                    page >=
                    parseInt(
                      ((userData?.totalHeads || 0) / pageSize + 1).toString()
                    )
                      ? '#'
                      : `/viewAll?page=${page + 1}`
                  }`}
                  passHref
                >
                  <a
                    className={`text-sm bg-primary hover:opacity-80 text-white font-semibold py-2 px-4 rounded-r ${
                      page >=
                      parseInt(
                        ((userData.totalHeads || 0) / pageSize + 1).toString()
                      )
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

      <Modal
        empty
        visible={membersModal !== undefined}
        onCancel={() => setMembersModal(undefined)}
      >
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
            {membersModal?.members?.map((member, index2) => (
              <tr key={member.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {index2 + 1}
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
                    {membersModal.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {member.relationWithHead}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  )
}

export default ViewAll
