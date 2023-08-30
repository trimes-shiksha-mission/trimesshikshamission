import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Link from "next/link";
import { Layout } from "~/components/Layout";
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.params?.id
  if (!token) return {
    notFound: true
  }

  return {
    props: {
      token
    }
  }
}

const ResetPassword: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ token }) => {

  const { mutateAsync: resetPassword, isLoading } = api.user.resetPassword.useMutation()

  return <Layout>
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-2">
      <div className="flex flex-col items-center justify-center w-full px-4">
        <form onSubmit={async (e) => {
          e.preventDefault()
          const password = e.currentTarget.password.value
          const confirmPassword = e.currentTarget.confirmPassword.value
          if (!password || !confirmPassword) return
          if (password !== confirmPassword) return alert('Password and confirm password doesn\'t match')
          try {
            await resetPassword({ token, password })
            alert('Password reset success!, Please login now.')

          } catch (error: any) {
            alert(error.message)
            console.error(error)
          }
        }} className="flex flex-col w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center w-full text-xl font-bold">
            Reset Password
          </div>
          <p className="text-center">
            Enter new password.
          </p>
          <div className="flex items-center justify-center w-full">
            <input
              className="w-full px-4 py-2 border rounded-md"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <input
              className="w-full px-4 py-2 border rounded-md"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
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
}

export default ResetPassword;