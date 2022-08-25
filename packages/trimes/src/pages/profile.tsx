import { Area, User } from '@prisma/client'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsFillPencilFill } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { useMutation, useQuery } from 'react-query'
import { Loading } from '../components/Loading'
import { ProtectedRoute } from '../components/ProtectedRoute'

type UserWithArea = User & {
  area: {
    name: string
  }
}

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
  } = useQuery('user', async (): Promise<UserWithArea | undefined> => {
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

  const { mutateAsync: updateUser } = useMutation(async (values: any) => {
    const user = await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    return await user.json()
  })

  const [addMemberForm, setAddMemberForm] = useState(false)
  const [userProfileEdit, setUserProfileEdit] = useState(false)
  const { data: areas, isLoading: getAreasLoading } = useQuery(
    'areas',
    async (): Promise<Area[]> => {
      if (!session?.user?.id) return []
      const areas = await fetch(`/api/area`)
      return await areas.json()
    },
    {
      enabled: userProfileEdit
    }
  )
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
        <div className="px-4 md:px-24">
          <div className="shadow-md rounded-lg p-2 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <FaUser />
                Profile
              </div>
              <button
                onClick={() => setUserProfileEdit(!userProfileEdit)}
                className="flex gap-2 items-center"
              >
                {userProfileEdit ? (
                  'Cancel'
                ) : (
                  <>
                    <BsFillPencilFill />
                    Edit
                  </>
                )}
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault()
                const target = e.currentTarget as any
                await updateUser({
                  userId: user.id,
                  name: target.name.value,
                  email: target.email.value,
                  birthday: target.birthday.value,
                  contact: target.contact.value,
                  gautra: target.gautra.value,
                  address: target.address.value,
                  bloodGroup: target.bloodGroup.value,
                  gender: target.gender.value,
                  qualification: target.qualification.value,
                  nativeTown: target.nativeTown.value,
                  familyAnnualIncome: parseFloat(
                    target.familyAnnualIncome.value
                  ),
                  areaId: target.areaId.value,
                  maritalStatus: target.maritalStatus.value,
                  isPrivateProperty: target.isPrivateProperty.checked,
                  occupation: target.occupation.value
                })
                setUserProfileEdit(false)
                await refetch()
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-x-8">
                <div className="grid grid-cols-2 gap-2">
                  <label>Name</label>
                  {userProfileEdit ? (
                    <input
                      name="name"
                      required
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.name}
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}
                  <label>Date of Birth</label>
                  {userProfileEdit ? (
                    <input
                      required
                      className="border border-gray-400 rounded-md px-2"
                      type="date"
                      name="birthday"
                      disabled={!userProfileEdit}
                      defaultValue={
                        new Date(user.birthday).getFullYear() +
                        '-' +
                        (new Date(user.birthday).getMonth() + 1) +
                        '-' +
                        new Date(user.birthday).getDate()
                      }
                    />
                  ) : (
                    <span>
                      {new Date(user.birthday).getDate() +
                        '-' +
                        (new Date(user.birthday).getMonth() + 1) +
                        '-' +
                        new Date(user.birthday).getFullYear()}
                    </span>
                  )}
                  <label>Email</label>
                  {userProfileEdit ? (
                    <input
                      name="email"
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.email || ''}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                  <label>Gautra</label>
                  {userProfileEdit ? (
                    <input
                      name="gautra"
                      required
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.gautra || ''}
                    />
                  ) : (
                    <span>{user.gautra}</span>
                  )}
                  <label>Blood Group</label>
                  {userProfileEdit ? (
                    <select
                      name="bloodGroup"
                      defaultValue={user.bloodGroup || ''}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <span>{user.bloodGroup || 'N/A'}</span>
                  )}
                  <label>Gender</label>
                  {userProfileEdit ? (
                    <select name="gender" defaultValue={user.gender} required>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <span>{user.gender}</span>
                  )}
                  <label>Qualification</label>
                  {userProfileEdit ? (
                    <input
                      name="qualification"
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.qualification}
                    />
                  ) : (
                    <span>{user.qualification}</span>
                  )}
                  <label>Native Town</label>
                  {userProfileEdit ? (
                    <input
                      name="nativeTown"
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.nativeTown}
                    />
                  ) : (
                    <span>{user.nativeTown}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 md:mt-0">
                  <label>Contact</label>
                  {userProfileEdit ? (
                    <input
                      required
                      name="contact"
                      className="border border-gray-400 rounded-md px-2"
                      type="number"
                      disabled={!userProfileEdit}
                      defaultValue={user.contact || ''}
                    />
                  ) : (
                    <span>{user.contact}</span>
                  )}
                  <label>Address</label>
                  {userProfileEdit ? (
                    <input
                      name="address"
                      required
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.address || ''}
                    />
                  ) : (
                    <span>{user.address}</span>
                  )}
                  <label>Family Annual Income</label>
                  {userProfileEdit ? (
                    <input
                      name="familyAnnualIncome"
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={parseFloat(
                        user.familyAnnualIncome?.toString() || '0'
                      )}
                    />
                  ) : (
                    <span>{user.familyAnnualIncome || 'N/A'}</span>
                  )}
                  <label>Belongs to</label>
                  {userProfileEdit && !getAreasLoading ? (
                    <select name="areaId" defaultValue={user.areaId ?? ''}>
                      <option value="">Select</option>
                      {areas?.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{user.area.name}</span>
                  )}
                  <label>Marital Status</label>
                  {userProfileEdit ? (
                    <select
                      name="maritalStatus"
                      required
                      defaultValue={user.maritalStatus}
                    >
                      <option value="">Select</option>
                      <option value="married">Married</option>
                      <option value="unmarried">Unmarried</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  ) : (
                    <span>{user.maritalStatus}</span>
                  )}
                  <label>Do you own the house where you live?</label>
                  {userProfileEdit ? (
                    <input
                      name="isPrivateProperty"
                      className="w-4"
                      type="checkbox"
                      disabled={!userProfileEdit}
                      defaultChecked={user.isPrivateProperty || false}
                    />
                  ) : (
                    <span>{user.isPrivateProperty ? 'Yes' : 'No'}</span>
                  )}
                  <label>Occupation</label>
                  {userProfileEdit ? (
                    <input
                      name="occupation"
                      className="border border-gray-400 rounded-md px-2"
                      type="text"
                      disabled={!userProfileEdit}
                      defaultValue={user.occupation}
                    />
                  ) : (
                    <span>{user.occupation}</span>
                  )}
                  {user.maritalStatus !== 'married' && (
                    <>
                      <label>Show in Matrimony</label>
                      {userProfileEdit ? (
                        <input
                          name="showInMatrimony"
                          className="w-4"
                          type="checkbox"
                          disabled={!userProfileEdit}
                          defaultChecked={user.showInMatrimony || false}
                        />
                      ) : (
                        <span>{user.showInMatrimony ? 'Yes' : 'No'}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              {userProfileEdit ? (
                <div className="mt-8 flex items-center justify-center">
                  <button
                    className="rounded-lg bg-[#FDAE09] text-white text-xl px-3 py-1"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              ) : null}
            </form>
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
