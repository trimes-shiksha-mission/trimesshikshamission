import { NextPage } from 'next'

const Registered: NextPage = () => {
  return (
    <div className="text-center text-xl">
      <h1>You have successfully registered</h1>
      {/* Login to website to continue */}

      <span>
        <a href="/login" className="text-blue-600">
          Login{' '}
        </a>
        to website to continue
      </span>
    </div>
  )
}

export default Registered
