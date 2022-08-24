import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Loading } from '../components/Loading'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Profile: NextPage = () => {
  const { data: session } = useSession()
  const [otherRelation, setOtherRelation] = useState(false)
  const { mutateAsync: register, isLoading: registerLoading } = useMutation(
    async (values: any) => {
      const user = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      return await user.json()
    }
  )
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = useQuery('user', async (): Promise<any> => {
    if (!session?.user?.id) return
    const user = await fetch(`/api/user?id=${session.user.id}`)
    return await user.json()
  })
  const {
    data: members,
    isLoading: getMembersLoading,
    refetch: refetchMembers
  } = useQuery('members', async (): Promise<any[]> => {
    if (!session?.user?.id) return []
    const members = await fetch(`/api/member?headId=${session.user.id}`)
    return await members.json()
  })
  const [addMemberForm, setAddMemberForm] = useState(false)
  useEffect(() => {
    refetch()
  }, [refetch, session])
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center w-full">
        <Link href="/api/auth/signout" passHref>
          <a className="rounded-md w-1/4 mt-2 bg-[#FDAE09] text-2xl text-white p-2 text-center">
            Logout
          </a>
        </Link>
      </div>
      {getUserLoading || !user ? (
        <Loading />
      ) : (
        <div className="container mx-auto mt-12 mb-60">
          <div className="bg-white relative shadow rounded-lg w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto">
            <div className="flex justify-center"></div>

            <div className="mt-16">
              <h1 className="font-bold text-center text-3xl text-gray-900">
                {user.name}
              </h1>
              <p className="text-center text-sm text-gray-400 font-medium">
                {new Date(user.birthday).toLocaleDateString()}
              </p>
              <p>
                <span></span>
              </p>
              <div className="my-5 px-6">
                <a
                  href={`mailto:${user.email}`}
                  className="text-white block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-orange-400 hover:bg-black hover:text-white"
                >
                  Email: <span className="font-bold">{user.email}</span>
                </a>
              </div>
              <div className="w-full">
                <h3 className="font-medium text-gray-900 text-left px-6">
                  Information
                </h3>
                <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">
                      Phone Number:{' '}
                    </span>
                    {user.contact}
                  </div>

                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">Gender: </span>
                    {user.gender}
                  </div>

                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">Gautra: </span>
                    {user.gautra}
                  </div>
                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">
                      Belongs to:{' '}
                    </span>
                    {user.area?.name}
                  </div>

                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">
                      Marital Status:{' '}
                    </span>
                    {user.maritalStatus}
                  </div>
                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150">
                    <span className="text-gray-500 text-bold">
                      Family Annual Income:{' '}
                    </span>
                    {user.familyAnnualIncome
                      ? 'Rs. ' + user.familyAnnualIncome
                      : 'Not Specified'}
                  </div>

                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden">
                    <span className="text-gray-500 text-bold">Address: </span>
                    {user.address}
                  </div>

                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden">
                    <span className="text-gray-500 text-bold">
                      Native Town:{' '}
                    </span>
                    {user.nativeTown}
                  </div>
                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden">
                    <span className="text-gray-500 text-bold">
                      Occupation:{' '}
                    </span>
                    {user.occupation}
                  </div>
                  <div className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden">
                    <span className="text-gray-500 text-bold">
                      Qualification:{' '}
                    </span>
                    {user.qualification}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full my-10 flex justify-center">
            <button
              className="w-1/2 bg-[#FDAE09] text-white rounded-md p-3 items-center text-2xl"
              onClick={() => setAddMemberForm(true)}
            >
              Add Member
            </button>
          </div>
          {addMemberForm ? (
            <form
              onSubmit={async e => {
                e.preventDefault()
                const target = e.currentTarget as any
                const headId = session?.user?.id
                if (!headId) return
                await register({
                  name: target.name.value,
                  email: target.email.value,
                  maritalStatus: target.maritalStatus.value,
                  gender: target.gender.value,
                  birthday: target.birthday.value,
                  contact: target.contact.value,
                  occupation: target.occupation.value,
                  qualification: target.qualification.value,
                  gautra: target.gautra.value,
                  nativeTown: target.nativeTown.value,
                  bloodGroup: target.bloodGroup.value,
                  address: target.address.value,
                  isPrivateProperty: target.isPrivateProperty.checked,
                  headId,
                  relationWithHead: target.relationWithHead.value
                })
                await refetch()
                setAddMemberForm(false)
              }}
            >
              <div className="grid md:grid-cols-2 gap-4 px-4 lg:mx-32 lg:gap-x-8 pt-2">
                <div>
                  <label className="block">
                    Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block">Contact</label>
                  <input
                    type="contact"
                    name="contact"
                    placeholder="Contact"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <div className="block">
                    Marital Status
                    <span className="text-red-600">*</span>
                  </div>

                  <label className="cursor-pointer ">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="married"
                      className=" px-4 py-2 mt-2"
                      defaultChecked
                    />{' '}
                    Married
                  </label>

                  <label className="cursor-pointer ml-2">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="unmarried"
                      className=" px-4 py-2 mt-2"
                    />{' '}
                    Unmarried
                  </label>

                  <label className="cursor-pointer ml-2">
                    {' '}
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="divorced"
                      className=" px-4 py-2 mt-2"
                    />{' '}
                    Divorced
                  </label>
                  <label className="cursor-pointer ml-2">
                    {' '}
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="widow"
                      className=" px-4 py-2 mt-2"
                    />{' '}
                    Widow
                  </label>
                </div>
                <div>
                  <div className="block">
                    Gender
                    <span className="text-red-600">*</span>
                  </div>

                  <label className="pr-4 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="px-4 py-2 mt-2"
                      defaultChecked
                    />{' '}
                    Male
                  </label>

                  <label className="pr-4 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="px-4 py-2 mt-2"
                    />{' '}
                    Female
                  </label>

                  <label className="pr-4 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      className="px-4 py-2 mt-2"
                    />{' '}
                    Other
                  </label>
                </div>

                <div>
                  <label className="block">
                    Relation with Head
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="relationWithHead"
                    required
                    onChange={e => {
                      if (e.target.value === 'other') {
                        setOtherRelation(true)
                      } else {
                        setOtherRelation(false)
                      }
                    }}
                  >
                    <option value="">Select</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="wife">Wife</option>
                    <option value="son">Son</option>
                    <option value="daughterInLaw">Daughter in Law</option>
                    <option value="daughter">Daughter</option>
                    <option value="grandSon">Grand Son</option>
                    <option value="grandDaughter">Grand Daughter</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block">
                    Date of Birth
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    placeholder="DD/MM/YYYY"
                    required
                  ></input>
                </div>
                {otherRelation ? (
                  <div>
                    <input
                      type="text"
                      required
                      name="relationWithHead"
                      placeholder="Please Specify relation with head*"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                ) : null}
                <div>
                  <label className="block">
                    Occupation
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Occupation"
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block">
                    Qualification
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    required
                    placeholder="Qualification"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block">
                    Gautra
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="gautra"
                    placeholder="Gautra"
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block">
                    Native Town
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="nativeTown"
                    required
                    placeholder="Native Town"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block">Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                  <label className="block">
                    Address
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    required
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="isPrivateProperty"
                      className="mr-2"
                    />
                    Do you own the house where you live?
                  </label>
                </div>
              </div>
              <div className="flex pt-2 justify-center items-center">
                <button
                  disabled={registerLoading}
                  className="px-6 py-2 mt-4 text-white w-64 bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Add {registerLoading && 'Loading...'}
                </button>
              </div>
            </form>
          ) : null}

          {getMembersLoading ? (
            'Loading Members...'
          ) : members?.length ? (
            // ?
            <>
              {members?.map(member => (
                <div
                  key={member.id}
                  className="bg-white relative shadow rounded-lg  mb-4 w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto }"
                >
                  <div className="flex justify-center"></div>

                  <div className="mt-16">
                    <h1 className="font-bold text-center text-3xl text-gray-900">
                      {member?.name}
                    </h1>
                    <p className="text-center text-sm text-gray-400 font-medium">
                      {new Date(member?.birthday).toLocaleDateString()}
                    </p>
                    <p>
                      <span></span>
                    </p>
                    <div className="my-5 px-6">
                      <a
                        href="#"
                        className="text-white block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-orange-400 hover:bg-black hover:text-white font-bold"
                      >
                        Email:{' '}
                        <span className="font-bold">{member?.email}</span>
                      </a>
                    </div>
                    <div className="w-full">
                      <h3 className="font-medium text-gray-900 text-left px-6">
                        Information
                      </h3>
                      <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                        <a
                          href=""
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                        >
                          <span className="text-gray-500 text-bold">
                            Phone Number:{' '}
                          </span>
                          {member?.contact}
                        </a>

                        <a
                          href=""
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                        >
                          <span className="text-gray-500 text-bold">
                            Gender:{' '}
                          </span>
                          {member?.gender}
                        </a>

                        <a
                          href=""
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                        >
                          <span className="text-gray-500 text-bold">
                            Gautra:{' '}
                          </span>
                          {member?.gautra}
                        </a>

                        <a
                          href=""
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                        >
                          <span className="text-gray-500 text-bold">
                            Marital Status:{' '}
                          </span>
                          {member?.maritalStatus}
                        </a>

                        <a
                          href="#"
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                        >
                          <span className="text-gray-500 text-bold">
                            Address:{' '}
                          </span>
                          {member?.address}
                        </a>

                        <a
                          href="#"
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                        >
                          <span className="text-gray-500 text-bold">
                            Native Town:{' '}
                          </span>
                          {member?.nativeTown}
                        </a>
                        <a
                          href="#"
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                        >
                          <span className="text-gray-500 text-bold">
                            Occupation:{' '}
                          </span>
                          {member?.occupation}
                        </a>
                        <a
                          href="#"
                          className="border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                        >
                          <span className="text-gray-500 text-bold">
                            Qualification:{' '}
                          </span>
                          {member?.qualification}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </ProtectedRoute>
  )
}

export default Profile
