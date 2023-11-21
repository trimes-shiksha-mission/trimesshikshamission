import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'
import { RouterOutputs, api } from '~/utils/api'
import { Modal } from '../components/Modal'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return { props: {} }
}

const ViewAll: NextPage = () => {
  //? States
  const [membersModal, setMembersModal] = useState<
    RouterOutputs['user']['getAll']['data'][0] | null
  >(null)
  const [variables, setVariables] = useState<{
    page: number
    limit: number
    name?: string
    qualification?: string
    occupation?: string
    gender?: 'male' | 'female' | 'other'
    gautra?: string
    bloodGroup?: 'O-' | 'O+' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'
    maritalStatus?: 'married' | 'unmarried' | 'divorced' | 'widowed'
    familyAnnualIncome?: string
    nativeTown?: string
    address?: string
    fatherName?: string
  }>({
    page: 1,
    limit: 10
  })

  //? Queries
  const { data: users, isLoading: getUsersLoading } =
    api.user.getAll.useQuery(variables)

  return (
    <Layout loading={getUsersLoading}>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Users</h2>
          </div>

          {/* filters for name, qualification, occupation, gender */}
          <form
            onSubmit={async e => {
              e.preventDefault()
              const form = e.currentTarget as any
              setVariables({
                ...variables,
                name: form.name.value || undefined,
                qualification: form.qualification.value || undefined,
                occupation: form.occupation.value || undefined,
                gender: form.gender.value || undefined,
                gautra: form.gautra.value || undefined,
                bloodGroup: form.bloodGroup.value || undefined,
                maritalStatus: form.maritalStatus.value || undefined,
                address: form.address.value || undefined,
                familyAnnualIncome: form.familyAnnualIncome.value || undefined,
                nativeTown: form.nativeTown.value || undefined,
                fatherName: form.fatherName.value || undefined,
                page: 1
              })
            }}
            className="grid grid-cols-2 gap-4 p-6"
          >
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name
              </label>
              <input
                defaultValue={variables.name}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="name"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Father&apos;s/Husband&apos;s Name
              </label>
              <input
                defaultValue={variables.fatherName}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="fatherName"
                placeholder="Father's Name"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Qualification
              </label>
              <input
                defaultValue={variables.qualification}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="qualification"
                placeholder="Qualification"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Occupation
              </label>
              <input
                defaultValue={variables.occupation}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="occupation"
                placeholder="Occupation"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Gender
              </label>
              <select
                defaultValue={variables.gender}
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
                defaultValue={variables.gautra}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="gautra"
              >
                <option value="">Choose...</option>
                {[
                  'Others',
                  'पराशर',
                  'अत्रि',
                  'भृगु',
                  'कौशिक',
                  'गौतम',
                  'वशिष्ठ',
                  'भारद्वाज',
                  'कपिल',
                  'भार्गव',
                  'वत्स',
                  'अगत्स्य',
                  'मार्कण्डेय',
                  'कश्यप',
                  'शांडिल्य',
                  'कौण्डिन्य',
                  'अज',
                  'कुश',
                  'जम्दग्नि',
                  'याज्ञवल्क्य',
                  'पुलत्स्य'
                ].map(gautra => (
                  <option key={gautra} value={gautra}>
                    {gautra}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Blood Group
              </label>
              <select
                defaultValue={variables.bloodGroup}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="bloodGroup"
              >
                <option value="">Select</option>
                <option value="O-">O-</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Marital Status
              </label>
              <select
                defaultValue={variables.maritalStatus}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="maritalStatus"
              >
                <option value="">Choose...</option>
                <option value="married">Married</option>
                <option value="unmarried">Unmarried</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Family Annual Income
              </label>
              <select
                defaultValue={variables.familyAnnualIncome}
                className="block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                name="familyAnnualIncome"
              >
                <option value="">Choose...</option>
                {[
                  'Up to 1 Lakh',
                  'Above 1 Lakh & Up to 2.5 Lakhs',
                  'Above 2.5 Lakhs & Up to 5 Lakhs',
                  'Above 5 Lakhs'
                ].map(income => (
                  <option key={income} value={income}>
                    {income}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Native Town
              </label>
              <input
                defaultValue={variables.nativeTown}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="nativeTown"
                placeholder="Native Town"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Address
              </label>
              <input
                defaultValue={variables.address}
                className="appearance-none block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                type="text"
                name="address"
                placeholder="Address"
              />
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
                  setVariables({
                    ...Object.keys(variables).reduce((acc, key) => {
                      ;(acc as any)[key] = undefined
                      return acc
                    }, {}),
                    page: 1,
                    limit: 10
                  })
                }}
              >
                Reset
              </button>
            </div>
          </form>

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
                      Father&apos;s Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gautra
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Blood Group
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
                      Family Annual Income
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Marital Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Native Town
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      View Members
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.data.map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {/* {console.log({ index, page: variables.page, limit: variables.limit })} */}
                          {index + 1 + (variables.page - 1) * variables.limit}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.name}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.fatherName}
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
                          {user.bloodGroup}
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
                          {user.familyAnnualIncome}
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
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.nativeTown}
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
              Showing {(variables.page - 1) * variables.limit + 1} to{' '}
              {variables.page >=
              parseInt(((users?.total || 0) / variables.limit + 1).toString())
                ? users?.total
                : (variables.page - 1) * variables.limit + variables.limit}{' '}
              of {users?.total} total Users: {users?.total}
            </span>

            <div className="inline-flex mt-2 xs:mt-0">
              <button
                onClick={() => {
                  if (variables.page <= 1) return
                  setVariables({
                    ...variables,
                    page: variables.page - 1
                  })
                }}
                disabled={variables.page <= 1}
                className={`text-sm bg-primary hover:opacity-80  text-white font-semibold py-2 px-4 rounded-l ${
                  variables.page <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }`}
              >
                Prev
              </button>
              <input
                className="text-center w-10 border border-gray-300 mx-2 rounded-md"
                type="number"
                min={1}
                max={parseInt(
                  ((users?.total || 0) / variables.limit + 1).toString()
                )}
                maxLength={parseInt(
                  ((users?.total || 0) / variables.limit + 1).toString()
                )}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  if (value < 1) {
                    e.target.value = '1'
                    return
                  }
                  if (
                    value >
                    parseInt(
                      ((users?.total || 0) / variables.limit + 1).toString()
                    )
                  ) {
                    e.target.value = parseInt(
                      ((users?.total || 0) / variables.limit + 1).toString()
                    ).toString()
                    return
                  }
                }}
                defaultValue={variables.page}
                onBlur={e => {
                  const value = parseInt(e.target.value)
                  if (
                    value >
                    parseInt(
                      ((users?.total || 0) / variables.limit + 1).toString()
                    )
                  ) {
                    e.target.value = parseInt(
                      ((users?.total || 0) / variables.limit + 1).toString()
                    ).toString()
                    return
                  }
                  if (value < 1) {
                    e.target.value = '1'
                    return
                  }
                  setVariables({
                    ...variables,
                    page: value
                  })
                }}
              ></input>
              {users?.total && users.total > variables.limit ? (
                <button
                  onClick={() => {
                    if (
                      variables.page >=
                      parseInt(
                        ((users?.total || 0) / variables.limit + 1).toString()
                      )
                    )
                      return
                    setVariables({
                      ...variables,
                      page: variables.page + 1
                    })
                  }}
                  disabled={
                    variables.page >=
                    parseInt(
                      ((users?.total || 0) / variables.limit + 1).toString()
                    )
                  }
                  className={`text-sm bg-primary hover:opacity-80 text-white font-semibold py-2 px-4 rounded-r ${
                    variables.page >=
                    parseInt(
                      ((users.total || 0) / variables.limit + 1).toString()
                    )
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  Next
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal empty open={!!membersModal} onCancel={() => setMembersModal(null)}>
        <table className="w-full leading-normal overflow-auto">
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
    </Layout>
  )
}

export default ViewAll
