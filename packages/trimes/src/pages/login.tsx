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
              <div className="mt-4">
                <label className="block">Password</label>
                <span className="text-red-600">
                  Head member द्वारा इस वेबसाइट पर बनाया गया स्वयं का पासवर्ड
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <button className="w-full justify-center items-center gap-2 flex px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                <span>Login</span>
                {/* loading spinner */}
                {loginLoading && (
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
    </>
  )
}
export default Login
