import { Area, User } from '@prisma/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { BsFillPencilFill } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md'
import { useMutation, useQuery } from 'react-query'
import { Loading } from '../components/Loading'
import { Modal } from '../components/Modal'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'

type UserWithArea = User & {
  area?: {
    name?: string
  }
}

const Profile: NextPage = () => {
  //? Session
  const { user: sessionUser } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })

  //? States
  const [otherRelation, setOtherRelation] = useState(false)
  const [membersVisible, setMembersVisible] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<User>()
  const [addMemberForm, setAddMemberForm] = useState(false)
  const [userProfileEdit, setUserProfileEdit] = useState(false)
  const [memberProfileEdit, setMemberProfileEdit] = useState<User>()
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  //? Queries
  const { data: areas, isLoading: getAreasLoading } = useQuery(
    'areas',
    async (): Promise<Area[]> => {
      if (!sessionUser?.id) return []
      return await fetchJson(`/api/area`)
    },
    {
      enabled: userProfileEdit
    }
  )
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = useQuery(
    'user',
    async (): Promise<UserWithArea | undefined> => {
      if (!sessionUser?.id) return
      return await fetchJson(`/api/user?id=${sessionUser.id}`)
    },
    {
      enabled: sessionUser?.id !== undefined
    }
  )
  const {
    data: members,
    isLoading: getMembersLoading,
    refetch: refetchMembers
  } = useQuery(
    'members',
    async (): Promise<User[]> => {
      if (!sessionUser?.id) return []
      const members = await fetch(`/api/member?headId=${sessionUser.id}`)
      return await members.json()
    },
    {
      enabled: false
    }
  )

  //? Mutations

  const { mutateAsync: register, isLoading: registerLoading } = useMutation(
    async (values: any) => {
      return await fetchJson('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
    }
  )
  const { mutateAsync: deleteUser, isLoading: deleteUserLoading } = useMutation(
    async (userId: string): Promise<User | undefined> => {
      if (!userId) return
      const user = await fetch(`/api/user?id=${userId}`, {
        method: 'DELETE'
      })
      return await user.json()
    }
  )
  const { mutateAsync: updateUser, isLoading: updateUserLoading } = useMutation(
    async (values: any) => {
      const user = await fetch(`/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      return await user.json()
    }
  )
  const { mutateAsync: changePassword, isLoading: changePasswordLoading } =
    useMutation(async (values: any) => {
      return await fetchJson(`/api/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
    })

  return (
    <>
      <div className="flex justify-center items-center gap-2 w-full">
        <Link
          href="/api/logout"
          className="rounded-md w-1/4 sm:w-1/5 mt-2 bg-[#FDAE09] text-xl text-white p-1 text-center"
        >
          Logout
        </Link>
        <button
          className="rounded-md  md:w-1/5 mt-2 bg-[#FDAE09] text-xl text-white p-1 text-center"
          onClick={() => setChangePasswordModal(!changePasswordModal)}
        >
          Change Password
        </button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-x-8 break-words">
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
                        (new Date(user.birthday).getMonth() + 1 < 10
                          ? '0'
                          : '') +
                        (new Date(user.birthday).getMonth() + 1) +
                        '-' +
                        (new Date(user.birthday).getDate() < 10 ? '0' : '') +
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
                      required
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
                      required
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
                    <select
                      name="areaId"
                      defaultValue={user.areaId ?? ''}
                      required
                    >
                      <option value="">Select</option>
                      {areas?.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{user?.area?.name || 'N/A'}</span>
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
                      required
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
          <div className="w-full my-10 flex justify-center gap-4">
            <button
              className="w-1/2 lg:w-1/4 bg-[#FDAE09] text-white rounded-md p-3 items-center text-xl"
              onClick={() => {
                setMembersVisible(false)
                setAddMemberForm(!addMemberForm)
              }}
            >
              {addMemberForm ? 'Cancel' : 'Add Member'}
            </button>
            <button
              className="w-1/2 lg:w-1/4 bg-red-400 text-white rounded-md p-3 items-center text-xl"
              onClick={async () => {
                if (!membersVisible) {
                  setAddMemberForm(false)
                  setMembersVisible(true)
                  await refetchMembers()
                } else {
                  setMembersVisible(false)
                }
              }}
            >
              {membersVisible
                ? getMembersLoading
                  ? 'Loading...'
                  : 'Hide Members'
                : 'List Members'}
            </button>
          </div>
          {membersVisible && !getMembersLoading ? (
            members?.length ? (
              <div className="overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Name
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Relation
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Age
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Gender
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Gautra
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Email
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Contact
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Address
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Native Town
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Occupation
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Qualification
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Marital Status
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Show in Matrimony
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members?.map(member => (
                      <tr key={member.id} className="bg-white border-b">
                        <th
                          scope="row"
                          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {member.name}
                        </th>
                        <td className="py-4 px-6">
                          {member.relationWithHead || 'Not Specified'}
                        </td>
                        <td className="py-4 px-6">
                          {new Date(Date.now()).getFullYear() -
                            new Date(member.birthday).getFullYear()}{' '}
                          yrs
                        </td>
                        <td className="py-4 px-6">
                          {member.gender.toUpperCase()}
                        </td>
                        <td className="py-4 px-6">{member.gautra}</td>
                        <td className="py-4 px-6">{member.email || 'N/A'}</td>
                        <td className="py-4 px-6">{member.contact || 'N/A'}</td>
                        <td className="py-4 px-6">{member.address}</td>
                        <td className="py-4 px-6">{member.nativeTown}</td>
                        <td className="py-4 px-6">{member.occupation}</td>
                        <td className="py-4 px-6">{member.qualification}</td>
                        <td className="py-4 px-6">{member.maritalStatus}</td>
                        <td className="py-4 px-6">
                          {member.showInMatrimony ? 'Yes' : 'No'}
                        </td>
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            className="rounded-md text-gray-600 flex items-center"
                            onClick={() => setMemberProfileEdit(member)}
                          >
                            <MdModeEditOutline />
                            Edit
                          </button>
                          <span>/</span>
                          <button
                            className="rounded-md text-red-600 flex items-center"
                            onClick={() => {
                              setMemberToDelete(member)
                            }}
                          >
                            <MdDeleteOutline />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No members found</div>
            )
          ) : null}
          {addMemberForm ? (
            <form
              onSubmit={async e => {
                e.preventDefault()
                const target = e.currentTarget as any
                const headId = sessionUser?.id
                if (!headId) return
                try {
                  const user: any = await register({
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
                  if (user.error) {
                    return alert(user.error)
                  }
                  await refetchMembers()
                  alert('Member added successfully!')
                  setAddMemberForm(false)
                } catch (error) {
                  alert('Some error occurred! Please report to administrator')
                }
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
                      value="widowed"
                      className=" px-4 py-2 mt-2"
                    />{' '}
                    Widowed
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
        </div>
      )}

      {memberToDelete ? (
        <Modal open={memberToDelete !== undefined}>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Member
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-500">
                  Are you sure you want to delete this member?
                  <br />
                  <span className="font-semibold text-black">
                    {memberToDelete.name}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={() => setMemberToDelete(undefined)}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-400 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Cancel
              </button>
            </span>
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                onClick={async () => {
                  await deleteUser(memberToDelete.id)
                  await refetchMembers()
                  setMemberToDelete(undefined)
                }}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Delete
              </button>
            </span>
          </div>
        </Modal>
      ) : null}

      {deleteUserLoading ? (
        <Modal open={deleteUserLoading} empty>
          <svg
            className="h-12 w-12 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Modal>
      ) : null}

      {/*  edit profile for member form */}
      {memberProfileEdit ? (
        <Modal open={memberProfileEdit !== undefined}>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const target = e.currentTarget as any
              const headId = sessionUser?.id
              if (!headId) return
              await updateUser({
                userId: memberProfileEdit.id,
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
              await refetchMembers()
              setMemberProfileEdit(undefined)
            }}
          >
            <div className="grid md:grid-cols-2 gap-4 px-4">
              <div>
                <label className="block">
                  Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={memberProfileEdit.name}
                  name="name"
                  placeholder="Name"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block">Email</label>
                <input
                  defaultValue={memberProfileEdit.email || undefined}
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">Contact</label>
                <input
                  defaultValue={memberProfileEdit.contact || undefined}
                  type="number"
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

                <select
                  defaultValue={memberProfileEdit.maritalStatus}
                  required
                  name="maritalStatus"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select</option>
                  <option value="married">Married</option>
                  <option value="unmarried">Unmarried</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <div className="block">
                  Gender
                  <span className="text-red-600">*</span>
                </div>

                <select
                  defaultValue={memberProfileEdit.gender}
                  name="gender"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block">
                  Relation with Head
                  <span className="text-red-600">*</span>
                </label>
                <select
                  name="relationWithHead"
                  required
                  defaultValue={memberProfileEdit.relationWithHead || undefined}
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
                  defaultValue={
                    new Date(memberProfileEdit.birthday).getFullYear() +
                    '-' +
                    (new Date(memberProfileEdit.birthday).getMonth() + 1 < 10
                      ? '0'
                      : '') +
                    (new Date(memberProfileEdit.birthday).getMonth() + 1) +
                    '-' +
                    (new Date(memberProfileEdit.birthday).getDate() < 10
                      ? '0'
                      : '') +
                    new Date(memberProfileEdit.birthday).getDate()
                  }
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
                    defaultValue={
                      memberProfileEdit.relationWithHead || undefined
                    }
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
                  defaultValue={memberProfileEdit.occupation}
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
                  defaultValue={memberProfileEdit.qualification}
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
                  defaultValue={memberProfileEdit.gautra}
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
                  defaultValue={memberProfileEdit.nativeTown}
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
                  defaultValue={memberProfileEdit.bloodGroup || ''}
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
                  defaultValue={memberProfileEdit.address}
                  placeholder="Address"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={
                      memberProfileEdit.isPrivateProperty || false
                    }
                    name="isPrivateProperty"
                    className="mr-2"
                  />
                  Do you own the house where you live?
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-center items-center">
              <button
                disabled={updateUserLoading}
                className="px-6 py-2 mt-4 text-white w-64 bg-blue-600 rounded-lg hover:bg-blue-900"
                type="submit"
              >
                Update {updateUserLoading && 'Loading...'}
              </button>
              <button
                className="px-6 py-2 mt-4 text-white w-64 bg-orange-600 rounded-lg hover:bg-orange-900"
                type="button"
                onClick={() => {
                  setMemberProfileEdit(undefined)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {changePasswordModal ? (
        <Modal open={changePasswordModal}>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const password = e.currentTarget.oldPassword.value
              const newPassword = e.currentTarget.newPassword.value
              const confirmPassword = e.currentTarget.confirmPassword.value
              if (newPassword !== confirmPassword) {
                alert('New Password and Confirm Password must be same')
                return
              }

              try {
                await changePassword({
                  password,
                  newPassword
                })
                alert('Password Changed Successfully')
                setChangePasswordModal(false)
              } catch (error: any) {
                alert(error.message || 'Something error occurred!')
              }
            }}
          >
            <div className="flex justify-end">
              {showPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  Hide Password
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  Show Password
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <label className="block">
                  Old Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="oldPassword"
                  placeholder="Old Password"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  New Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block">
                  Confirm Password
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-center items-center">
              <button
                disabled={changePasswordLoading}
                className="px-6 py-2 mt-4 text-white w-64 bg-red-400 rounded-lg hover:bg-red-300"
                type="submit"
              >
                Change Password{' '}
                {changePasswordLoading && (
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                    ></path>
                  </svg>
                )}
              </button>
              <button
                className="px-6 py-2 mt-4 text-white w-64 bg-[#FDAE09] rounded-lg hover:bg-[#FDA000]"
                type="button"
                onClick={() => {
                  setChangePasswordModal(false)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}

export default Profile
