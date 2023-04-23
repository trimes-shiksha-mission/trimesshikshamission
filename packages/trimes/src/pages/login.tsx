import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'

const Login: NextPage = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  })
  const [loginLoading, setLoginLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
              setLoginLoading(true)
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
              } catch (error: any) {
                setErrorMsg(error.data.message)
              }
              setLoginLoading(false)
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
              <div className="mt-4 relative">
                <label className="block">Password</label>
                <span className="text-red-600">
                  Head member द्वारा इस वेबसाइट पर बनाया गया स्वयं का पासवर्ड
                </span>
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
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />

                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    className="p-1 mr-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                  ></button>
                </div>
              </div>
              <button className="w-full justify-center items-center gap-2 flex px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                {/* loading spinner */}
                {loginLoading ? (
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
                ) : (
                  <span>Login</span>
                )}
              </button>
              {errorMsg && <div className="mt-4 text-red-600">{errorMsg}</div>}
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

      {errorMsg === 'User not verified!' && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button
                className="text-2xl font-bold"
                onClick={() => setErrorMsg('')}
              >
                &times;
              </button>
            </div>
            <h3 className="text-2xl font-bold text-center">
              Your account is not verified yet.
            </h3>
            <p className="mt-4 text-center">
              Please wait for the admin to verify your account.
            </p>
            <div className="flex justify-center mt-4">
              <Link href="/">
                <a className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                  Go to Home
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Login
