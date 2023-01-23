import { NextPage } from 'next'
import Link from 'next/link'

const Logout: NextPage = () => {
  return (
    <div className="min-h-[50vh]">
      {/* Create a logout page saying succesfully logged out with homepage url */}

      <h1 className="text-center text-5xl mt-8 font-semibold text-primary">
        You&apos;ve been Logged Out successfully
      </h1>
      <Link href="/" className="w-full text-center block text-blue-500 mt-8">
        Go to homepage
      </Link>
    </div>
  )
}

export default Logout
