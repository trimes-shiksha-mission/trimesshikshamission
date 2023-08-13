import { NextPage } from 'next'
import Link from 'next/link'

const Registered: NextPage = () => {
  return (
    <div className="text-center text-xl">
      <div>
        <Link href="/login" className="text-blue-600">
          Login&nbsp;
        </Link>
        <span>to website to continue</span>
      </div>
    </div>
  )
}

export default Registered
