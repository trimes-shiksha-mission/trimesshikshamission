import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import Link from 'next/link'

const Profile: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = useQuery('user', async (): Promise<any> => {
    if (!session?.userId) return
    const user = await fetch(`/api/user?id=${session?.userId}`)
    return await user.json()
  })
  console.log(session)
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
  console.log({'world':user})
  return (
    <>
      <div className="container mx-auto my-60">
        <div>
          <div className="bg-white relative shadow rounded-lg w-5/6 md:w-4/6  lg:w-3/6 xl:w-2/6 mx-auto">
            <div className="flex justify-center">
             
            </div>

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
                    <span className="text-gray-500 text-bold">Qualification: </span>
                    {user?.qualification}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
