import { NextPage } from 'next'
import Link from 'next/link'

const ForgotPassword: NextPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-2">
        <div className="flex flex-col items-center justify-center w-full px-4">
          <div className="flex flex-col w-full max-w-sm space-y-4">
            <div className="flex items-center justify-center w-full text-xl font-bold">
              Forgot Password?
            </div>
            <p className="text-center">
              Enter your email address below and we&apos;ll send you a link to
              reset your password.
            </p>
            <div className="flex items-center justify-center w-full">
              <input
                className="w-full px-4 py-2 border rounded-md"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <button className="w-full px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-md">
                Submit
              </button>
            </div>
            <div className="flex items-center justify-center w-full">
              <Link className="text-blue-500" href="/login">
                Already have an account? Login here
              </Link>
            </div>

            <div className="flex items-center justify-center w-full text-grey-dark">
              Dont&apos;t have an account?{' '}
              <Link href="/register">
                <a className="text-blue-600 hover:underline">Register Here</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
