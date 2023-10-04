import { GetServerSideProps, NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { BsFillPencilFill } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md'
import { Layout } from '~/components/Layout'
import { Modal } from '~/components/Modal'
import { Spinner } from '~/components/Spinner'
import { getServerAuthSession } from '~/server/auth'
import { RouterOutputs, api } from '~/utils/api'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
          destination: '/login'
        }
      : undefined,
    props: {}
  }
}

const Profile: NextPage = () => {
  //? Session
  const { data: session, update } = useSession()

  //? States
  const [otherRelation, setOtherRelation] = useState(false)
  const [membersVisible, setMembersVisible] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<
    RouterOutputs['user']['getMembers'][0] | null
  >(null)
  const [addMemberForm, setAddMemberForm] = useState(false)
  const [userProfileEdit, setUserProfileEdit] = useState(false)
  const [memberProfileEdit, setMemberProfileEdit] = useState<
    RouterOutputs['user']['getMembers'][0] | null
  >(null)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  //? Queries
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = api.user.profile.useQuery(undefined, {
    enabled: !!session?.user
  })
  const { data: areas } = api.area.getAll.useQuery()
  const {
    data: members,
    isLoading: getMembersLoading,
    refetch: refetchMembers
  } = api.user.getMembers.useQuery(undefined, {
    enabled: membersVisible
  })

  //? Mutations
  const { mutateAsync: changePassword, isLoading: changePasswordLoading } =
    api.user.changePassword.useMutation()
  const { mutateAsync: updateProfile, isLoading: updateProfileLoading } =
    api.user.updateProfile.useMutation()
  const { mutateAsync: registerMember, isLoading: registerMemberLoading } =
    api.user.registerMember.useMutation()
  const { mutateAsync: deleteMember, isLoading: deleteMemberLoading } =
    api.user.deleteMember.useMutation()
  const { mutateAsync: updateMember, isLoading: updateMemberLoading } =
    api.user.updateMember.useMutation()

  return (
    <Layout loading={getUserLoading}>
      <div className="flex justify-center items-center gap-2 w-full">
        <button
          onClick={() => signOut({ callbackUrl: '/logout' })}
          className="rounded-md w-1/4 sm:w-1/5 mt-2 bg-primary text-xl text-white p-1 text-center"
        >
          Logout
        </button>
        <button
          className="rounded-md  md:w-1/5 mt-2 bg-primary text-xl text-white p-1 text-center"
          onClick={() => setChangePasswordModal(!changePasswordModal)}
        >
          Change Password
        </button>
      </div>

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
              await updateProfile({
                name: target.name.value,
                email: target.email.value,
                birthday: new Date(target.birthday.value),
                contact: target.contact.value,
                gautra: target.gautra.value,
                address: target.address.value,
                bloodGroup: target.bloodGroup.value,
                gender: target.gender.value,
                qualification: target.qualification.value,
                nativeTown: target.nativeTown.value,
                familyAnnualIncome: target.familyAnnualIncome.value,
                areaId: target.areaId.value,
                maritalStatus: target.maritalStatus.value,
                isPrivateProperty: target.isPrivateProperty.checked,
                occupation: target.occupation.value,
                fatherName: target.fatherName.value
              })
              await refetch()
              await update()
              setUserProfileEdit(false)
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
                    defaultValue={user?.name}
                  />
                ) : (
                  <span>{user?.name}</span>
                )}
                <label>Father&apos;s / Husband&apos;s Name</label>
                {userProfileEdit ? (
                  <input
                    name="fatherName"
                    required
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    disabled={!userProfileEdit}
                    defaultValue={user?.fatherName || ''}
                  />
                ) : (
                  <span>{user?.fatherName}</span>
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
                      user
                        ? new Date(user.birthday).getFullYear() +
                          '-' +
                          (new Date(user.birthday).getMonth() + 1 < 10
                            ? '0'
                            : '') +
                          (new Date(user.birthday).getMonth() + 1) +
                          '-' +
                          (new Date(user.birthday).getDate() < 10 ? '0' : '') +
                          new Date(user.birthday).getDate()
                        : ''
                    }
                  />
                ) : (
                  <span>
                    {user
                      ? new Date(user.birthday).getDate() +
                        '-' +
                        (new Date(user.birthday).getMonth() + 1) +
                        '-' +
                        new Date(user.birthday).getFullYear()
                      : ''}
                  </span>
                )}
                <label>Email</label>
                {userProfileEdit ? (
                  <input
                    name="email"
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    disabled={!userProfileEdit}
                    defaultValue={user?.email || ''}
                  />
                ) : (
                  <span>{user?.email}</span>
                )}
                <label>Gautra</label>
                {userProfileEdit ? (
                  <select
                    name="gautra"
                    defaultValue={user?.gautra || ''}
                    required
                  >
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
                ) : (
                  <span>{user?.gautra}</span>
                )}
                <label>Blood Group</label>
                {userProfileEdit ? (
                  <select
                    name="bloodGroup"
                    defaultValue={user?.bloodGroup || ''}
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
                  <span>{user?.bloodGroup || 'N/A'}</span>
                )}
                <label>Gender</label>
                {userProfileEdit ? (
                  <select name="gender" defaultValue={user?.gender} required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span>{user?.gender}</span>
                )}
                <label>Qualification</label>
                {userProfileEdit ? (
                  <input
                    name="qualification"
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    required
                    disabled={!userProfileEdit}
                    defaultValue={user?.qualification}
                  />
                ) : (
                  <span>{user?.qualification}</span>
                )}
                <label>Native Town</label>
                {userProfileEdit ? (
                  <input
                    name="nativeTown"
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    disabled={!userProfileEdit}
                    defaultValue={user?.nativeTown}
                    required
                  />
                ) : (
                  <span>{user?.nativeTown}</span>
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
                    defaultValue={user?.contact || ''}
                  />
                ) : (
                  <span>{user?.contact}</span>
                )}
                <label>Address</label>
                {userProfileEdit ? (
                  <input
                    name="address"
                    required
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    disabled={!userProfileEdit}
                    defaultValue={user?.address || ''}
                  />
                ) : (
                  <span>{user?.address}</span>
                )}
                <label>Family Annual Income</label>
                {userProfileEdit ? (
                  <select
                    name="familyAnnualIncome"
                    defaultValue={user?.familyAnnualIncome || ''}
                  >
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
                ) : (
                  <span>{user?.familyAnnualIncome || 'N/A'}</span>
                )}
                <label>Belongs to</label>
                {userProfileEdit ? (
                  <select
                    name="areaId"
                    defaultValue={user?.areaId ?? ''}
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
                    defaultValue={user?.maritalStatus}
                  >
                    <option value="">Select</option>
                    <option value="married">Married</option>
                    <option value="unmarried">Unmarried</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                ) : (
                  <span>{user?.maritalStatus}</span>
                )}
                <label>Do you own the house where you live?</label>
                {userProfileEdit ? (
                  <input
                    name="isPrivateProperty"
                    className="w-4"
                    type="checkbox"
                    disabled={!userProfileEdit}
                    defaultChecked={user?.isPrivateProperty || false}
                  />
                ) : (
                  <span>{user?.isPrivateProperty ? 'Yes' : 'No'}</span>
                )}
                <label>Occupation</label>
                {userProfileEdit ? (
                  <input
                    required
                    name="occupation"
                    className="border border-gray-400 rounded-md px-2"
                    type="text"
                    disabled={!userProfileEdit}
                    defaultValue={user?.occupation}
                  />
                ) : (
                  <span>{user?.occupation}</span>
                )}
                {user?.maritalStatus !== 'married' && (
                  <>
                    <label>Show in Matrimony</label>
                    {userProfileEdit ? (
                      <input
                        name="showInMatrimony"
                        className="w-4"
                        type="checkbox"
                        disabled={!userProfileEdit}
                        defaultChecked={user?.showInMatrimony || false}
                      />
                    ) : (
                      <span>{user?.showInMatrimony ? 'Yes' : 'No'}</span>
                    )}
                  </>
                )}
              </div>
            </div>
            {userProfileEdit ? (
              <div className="mt-8 flex items-center justify-center">
                <button
                  className="rounded-lg flex justify-center gap-2 items-center bg-primary text-white text-xl px-3 py-1"
                  type="submit"
                >
                  Update
                  <Spinner loading={updateProfileLoading} />
                </button>
              </div>
            ) : null}
          </form>
        </div>
        <div className="w-full my-10 flex justify-center gap-4">
          <button
            className="w-1/2 lg:w-1/4 bg-primary text-white rounded-md p-3 items-center text-xl"
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
                      Father&apos;s/Husband&apos;s Name
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
                      <td className="py-4 px-6">{member.fatherName || ''}</td>
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

              try {
                await registerMember({
                  name: target.name.value,
                  email: target.email.value || undefined,
                  maritalStatus: target.maritalStatus.value,
                  gender: target.gender.value,
                  birthday: new Date(target.birthday.value),
                  contact: target.contact.value || undefined,
                  occupation: target.occupation.value,
                  qualification: target.qualification.value,
                  gautra: target.gautra.value,
                  nativeTown: target.nativeTown.value,
                  bloodGroup: target.bloodGroup.value,
                  address: target.address.value,
                  isPrivateProperty: target.isPrivateProperty.checked,
                  relationWithHead: target.relationWithHead.value,
                  fatherName: target.fatherName.value
                })
                await refetchMembers()
                alert('Member added successfully!')
                setAddMemberForm(false)
              } catch (error: any) {
                alert(
                  error.message ||
                    'Some error occurred! Please report to administrator'
                )
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
                <label className="block">
                  Father&apos;s/Husband&apos;s Name
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
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
                <select
                  name="gautra"
                  defaultValue={user?.gautra || ''}
                  required
                >
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
                disabled={registerMemberLoading}
                className="px-6 py-2 mt-4 flex items-center justify-center gap-2 text-white w-64 bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                <span>Add</span>
                <Spinner loading={registerMemberLoading} />
              </button>
            </div>
          </form>
        ) : null}
      </div>

      <Modal open={!!memberToDelete}>
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
                  {memberToDelete?.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
            <button
              type="button"
              onClick={() => setMemberToDelete(null)}
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-400 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              Cancel
            </button>
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <button
              type="button"
              onClick={async () => {
                if (!memberToDelete) return
                await deleteMember(memberToDelete.id)
                await refetchMembers()
                setMemberToDelete(null)
              }}
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              Delete
            </button>
          </span>
        </div>
      </Modal>

      <Modal open={deleteMemberLoading} empty>
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

      <Modal open={!!memberProfileEdit}>
        <form
          onSubmit={async e => {
            e.preventDefault()
            const target = e.currentTarget as any
            if (!memberProfileEdit) return
            await updateMember({
              userId: memberProfileEdit.id,
              name: target.name.value,
              email: target.email.value || undefined,
              maritalStatus: target.maritalStatus.value,
              gender: target.gender.value,
              birthday: new Date(target.birthday.value),
              contact: target.contact.value || undefined,
              occupation: target.occupation.value,
              qualification: target.qualification.value,
              gautra: target.gautra.value,
              nativeTown: target.nativeTown.value,
              bloodGroup: target.bloodGroup.value,
              address: target.address.value,
              isPrivateProperty: target.isPrivateProperty.checked,
              relationWithHead: target.relationWithHead.value,
              fatherName: target.fatherName.value
            })
            await refetchMembers()
            setMemberProfileEdit(null)
          }}
        >
          <div className="grid md:grid-cols-2 gap-4 px-4">
            <div>
              <label className="block">
                Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                defaultValue={memberProfileEdit?.name}
                name="name"
                placeholder="Name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block">
                Father&apos;s/Husband&apos;s Name
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                defaultValue={memberProfileEdit?.fatherName || ''}
                name="fatherName"
                placeholder="Father's/Husband's Name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block">Email</label>
              <input
                defaultValue={memberProfileEdit?.email || undefined}
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block">Contact</label>
              <input
                defaultValue={memberProfileEdit?.contact || undefined}
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
                defaultValue={memberProfileEdit?.maritalStatus}
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
                defaultValue={memberProfileEdit?.gender}
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
                defaultValue={memberProfileEdit?.relationWithHead || undefined}
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
                  memberProfileEdit
                    ? new Date(memberProfileEdit.birthday).getFullYear() +
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
                    : ''
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
                    memberProfileEdit?.relationWithHead || undefined
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
                defaultValue={memberProfileEdit?.occupation}
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
                defaultValue={memberProfileEdit?.qualification}
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
              <select
                name="gautra"
                defaultValue={memberProfileEdit?.gautra || ''}
                required
              >
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
              <label className="block">
                Native Town
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                defaultValue={memberProfileEdit?.nativeTown}
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
                defaultValue={memberProfileEdit?.bloodGroup || ''}
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
                defaultValue={memberProfileEdit?.address}
                placeholder="Address"
                required
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  defaultChecked={memberProfileEdit?.isPrivateProperty || false}
                  name="isPrivateProperty"
                  className="mr-2"
                />
                Do you own the house where you live?
              </label>
            </div>
          </div>
          {
            <div className="flex gap-2 pt-2 justify-center items-center">
              <button
                disabled={updateMemberLoading}
                className="px-6 py-2 mt-4 flex items-center justify-center gap-2 text-white w-64 bg-blue-600 rounded-lg hover:bg-blue-900"
                type="submit"
              >
                <span>Update</span>
                <Spinner loading={updateMemberLoading} />
              </button>
              <button
                className="px-6 py-2 mt-4 text-white w-64 bg-orange-600 rounded-lg hover:bg-orange-900"
                type="button"
                onClick={() => {
                  setMemberProfileEdit(null)
                }}
              >
                Cancel
              </button>
            </div>
          }
        </form>
      </Modal>

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
              const response = await changePassword({
                oldPassword: password,
                newPassword
              })
              alert(response)
              setChangePasswordModal(false)
            } catch (error: any) {
              alert(error.message || 'Some error occurred')
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
              className="px-6 py-2 flex gap-2 justify-center items-center mt-4 text-white w-64 bg-red-400 rounded-lg hover:bg-red-300"
              type="submit"
            >
              <span>Change Password</span>
              <Spinner loading={changePasswordLoading} />
            </button>
            <button
              className="px-6 py-2 mt-4 text-white w-64 bg-primary rounded-lg hover:bg-primaryDark"
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
    </Layout>
  )
}

export default Profile
