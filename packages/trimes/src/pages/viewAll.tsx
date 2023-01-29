import { User } from '@prisma/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5'
import { useMutation, useQuery } from 'react-query'
import { Modal } from '../components/Modal'
import { ProtectedRoute } from '../components/ProtectedRoute'
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
  const router = useRouter()
  const queryPage = parseInt((router.query.page as string) || '1')
  const [page, setPage] = useState(queryPage)
  const { data: userData, isLoading: getUsersLoading } = useQuery(
    [page],
    async () => {
      if (page === -1) return
      if (selectedFilters !== null) return
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
    }
  )
  const [filteredUsers, setFilteredUsers] = useState<{
    users: any[]
    count: number
  }>()
  const { mutateAsync: getFilteredUsers } = useMutation(
    async (filters: any) => {
      const data = await fetch('/api/userfilters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      })
      return await data.json()
    }
  )
  const [selectedFilters, setSelectedFilters] = useState<{
    name: string
    qualification: string
    occupation: string
    gender: string
    gautra: string
    currPage: number
  } | null>(null)
  useEffect(() => {
    if (queryPage !== -1) {
      setPage(queryPage)
    }
  }, [page, queryPage])

  useEffect(() => {
    if (page >= 1 && selectedFilters !== null) {
      getFilteredUsers({ ...selectedFilters, currPage: page }).then(data => {
        setFilteredUsers({
          users: data.filteredUsers,
          count: data.count
        })
      })
    }
  }, [getFilteredUsers, page, selectedFilters])

  if (getUsersLoading) {
    return <div>Loading...</div>
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Users</h2>
          </div>

          {/* filters for name, qualification, occupation, gender */}
          <form
            onSubmit={async e => {
              e.preventDefault()
              router.push(
                {
                  pathname: '/viewAll'
                },
                undefined,
                { shallow: true }
              )
              setPage(1)
              const form = e.currentTarget as any
              const tempFilters = {
                name: form.name.value,
                qualification: form.qualification.value,
                occupation: form.occupation.value,
                gender: form.gender.value,
                gautra: form.gautra.value,
                currPage: 0
              }
              const data = await getFilteredUsers(tempFilters)
              setSelectedFilters(tempFilters)
              setFilteredUsers({
                users: data.filteredUsers,
                count: data.count
              })
              console.log(data.count)
            }}
            className="grid grid-cols-2 gap-4 p-6"
          >
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name
              </label>
              <input
                defaultValue={selectedFilters?.name}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="name"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Qualification
              </label>
              <select
                defaultValue={selectedFilters?.qualification}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="qualification"
              >
                <option value="">Choose...</option>
                {filters?.qualification.map(qualification => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Occupation
              </label>
              <select
                defaultValue={selectedFilters?.occupation}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="occupation"
              >
                <option value="">Choose...</option>
                {filters?.occupation.map(occupation => (
                  <option key={occupation} value={occupation}>
                    {occupation}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Gender
              </label>
              <select
                defaultValue={selectedFilters?.gender}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="gender"
              >
                <option value="">Choose...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Others</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Gautra
              </label>
              <select
                defaultValue={selectedFilters?.gautra}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="gautra"
              >
                <option value="">Choose...</option>
                {filters?.gautra.map(gautra => (
                  <option key={gautra} value={gautra}>
                    {gautra}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-8 gap-8 col-span-2">
              <button className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  rounded">
                Search
              </button>
              {/* reset button */}
              <button
                type="reset"
                className="col-span-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded"
                onClick={() => {
                  setPage(1)
                  setSelectedFilters(null)
                  setFilteredUsers(undefined)
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              {filteredUsers?.users.length ? (
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
                    {filteredUsers?.users.map((user: any, index: number) => (
                      <tr key={user.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {(page - 1) * 10 + index + 1}
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
                            {user.head?.name}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.relationWithHead}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
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
                        Contact
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
                          <p className="text-gray-900 whitespace-no-wrap">
                            {user.contact}
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
              )}
            </div>
          </div>

          <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
            {filteredUsers?.users.length ? (
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {page >=
                parseInt(((filteredUsers.count || 0) / pageSize + 1).toString())
                  ? filteredUsers.count
                  : (page - 1) * pageSize + pageSize}{' '}
                of {filteredUsers.count} Members using search criteria
                <br />
              </span>
            ) : (
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {page >=
                parseInt(
                  ((userData?.totalHeads || 0) / pageSize + 1).toString()
                )
                  ? userData?.totalHeads
                  : (page - 1) * pageSize + pageSize}{' '}
                of {userData?.totalHeads} Head Members
                <br />
                Total Users (including members): {userData?.totalUsers}
              </span>
            )}
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
              {filteredUsers?.users.length ? (
                <Link
                  href={`${
                    page >=
                    parseInt(
                      ((filteredUsers.count || 0) / pageSize + 1).toString()
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
                        ((filteredUsers.count || 0) / pageSize + 1).toString()
                      )
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    Next
                  </a>
                </Link>
              ) : userData?.totalHeads && userData?.totalHeads > pageSize ? (
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
    </ProtectedRoute>
  )
}

export default ViewAll
