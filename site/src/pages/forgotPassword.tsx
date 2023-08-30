import { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '~/components/Layout'
import { Spinner } from '~/components/Spinner'
import { api } from '~/utils/api'

const ForgotPassword: NextPage = () => {

  const { mutateAsync: forgotPassword, isLoading } = api.user.forgotPassword.useMutation()

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-2">
        <div className="flex flex-col items-center justify-center w-full px-4">
          <form onSubmit={async (e) => {
            e.preventDefault()
            const email = e.currentTarget.email.value
            if (!email) return
            try {
              await forgotPassword({ email })
              alert('Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.')
            } catch (error: any) {
              alert(error.message)
              console.error(error)
            }
          }} className="flex flex-col w-full max-w-sm space-y-4">
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
                name="email"
                required
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-md">
                <span>Submit</span>
                <Spinner loading={isLoading} />
              </button>
            </div>
            <div className="flex items-center justify-center w-full">
              <Link className="text-blue-500" href="/login">
                Already have an account? Login here
              </Link>
            </div>

            <div className="flex items-center justify-center w-full text-grey-dark">
              Dont&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword
