import { NextPage } from 'next'
import Link from 'next/link'

const Registered: NextPage = () => {
  return (
    <div className="text-center text-xl">
      <h1>You have successfully registered</h1>
      {/* Login to website to continue */}

      <span>
        <Link href="/login" className="text-blue-600">
          Login{' '}
        </Link>
        to website to continue
      </span>
    </div>
  )
}

export default Registered
