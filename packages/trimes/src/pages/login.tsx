import { NextPage } from 'next'
import Link from 'next/link'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'

const Login: NextPage = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  })

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
          <div className="flex justify-center"></div>
          <h3 className="text-2xl font-bold text-center">
            Login into your Trimes Account
          </h3>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const body = {
                contact: e.currentTarget.contact.value,
                password: e.currentTarget.password.value
              }
              try {
                mutateUser(
                  await fetchJson('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                  })
                )
              } catch (error) {
                alert('Error logging in')
              }
            }}
          >
            <div className="mt-4">
              <div className="mt-4">
                <label className="block">Phone Number</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Number"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="mt-4">
                <label className="block">Password</label>
                <span className='text-red-600'>This is the password that head member created at time of registering on trimes shiksha mission</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <span className="text-xs text-red-400 hidden">
                Password must be same!
              </span>
              <div className="flex">
                <button className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Login
                </button>
              </div>
              <div className="mt-6 text-grey-dark">
                Dont&apos;t have an account?{' '}
                <Link href="/register">
                  <a className="text-blue-600 hover:underline">Register Here</a>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
export default Login
