import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

const Profile: NextPage = () => {
  const { data: session } = useSession()
  const {
    data: registerdUser,
    mutateAsync: register,
    isLoading: registerLoading
  } = useMutation(async (values: any) => {
    const user = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    return await user.json()
  })
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = useQuery('user', async (): Promise<any> => {
    if (!session?.userId) return
    const user = await fetch(`/api/user?id=${session?.userId}`)
    return await user.json()
  })
  const { data: members } = useQuery('members', async (): Promise<any> => {
    if (!session?.userId) return []
    const members = await fetch(`/api/members?headId=${session?.userId}`)
    return await members.json()
  })
  const [addMemberForm, setAddMemberFor] = useState(false)
  useEffect(() => {
    refetch()
  }, [session])
  console.log(user, session)
  if (!session?.userId) {
    // router?.push('/login')
    return (
      <>
        <div className="w-full text-center text-3xl mb-96 mt-20">
          Please
          <Link href="/login">
            <a className="text-sky-500 text-bold"> Login </a>
          </Link>
          to Website
        </div>
      </>
    )
  }
  return (
    <>
      <div className="container mx-auto my-60">
        <div>
          <div className="bg-white relative shadow rounded-lg w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto">
            <div className="flex justify-center"></div>

            <div className="mt-16">
              <h1 className="font-bold text-center text-3xl text-gray-900">
                {user?.name}
              </h1>
              <p className="text-center text-sm text-gray-400 font-medium">
                {user?.birthday}
              </p>
              <p>
                <span></span>
              </p>
              <div className="my-5 px-6">
                <a
                  href="#"
                  className="text-gray-200 block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-gray-900 hover:bg-black hover:text-white"
                >
                  Connect with <span className="font-bold">{user?.email}</span>
                </a>
              </div>
              <div className="w-full">
                <h3 className="font-medium text-gray-900 text-left px-6">
                  Information
                </h3>
                <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                  <a
                    href=""
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                  >
                    <span className="text-gray-500 text-bold">
                      Phone Number:{' '}
                    </span>
                    {user?.contact}
                  </a>

                  <a
                    href=""
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                  >
                    <span className="text-gray-500 text-bold">Gender: </span>
                    {user?.gender}
                  </a>

                  <a
                    href=""
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                  >
                    <span className="text-gray-500 text-bold">Gautra: </span>
                    {user?.gautra}
                  </a>

                  <a
                    href=""
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                  >
                    <span className="text-gray-500 text-bold">
                      Marital Status:{' '}
                    </span>
                    {user?.maritalStatus}
                  </a>

                  <a
                    href="#"
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                  >
                    <span className="text-gray-500 text-bold">Address: </span>
                    {user?.address}
                  </a>

                  <a
                    href="#"
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                  >
                    <span className="text-gray-500 text-bold">
                      Native Town:{' '}
                    </span>
                    {user?.nativeTown}
                  </a>
                  <a
                    href="#"
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                  >
                    <span className="text-gray-500 text-bold">
                      Occupation:{' '}
                    </span>
                    {user?.occupation}
                  </a>
                  <a
                    href="#"
                    className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                  >
                    <span className="text-gray-500 text-bold">
                      Qualification:{' '}
                    </span>
                    {user?.qualification}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            className="bg-black text-white rounded-md p-3"
            onClick={() => setAddMemberFor(true)}
          >
            Add Member
          </button>
          {addMemberForm ? (
            <form
              onSubmit={async e => {
                e.preventDefault()
                const target = e.currentTarget as any
                if (target.password.value !== target.confirmPassword.value) {
                  alert('Passwords do not match')
                  return
                }
                const headId = session.userId
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
                  headId
                })
              }}
            >
              <div className="grid md:grid-cols-2 gap-4">
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
              <div className="flex">
                <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Add
                </button>
              </div>
            </form>
          ) : null}

          {JSON.stringify(members)}
        </div>
      </div>
    </>
  )
}

export default Profile
