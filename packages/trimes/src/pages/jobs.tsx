import { NextPage } from 'next'
import Link from 'next/link'


const Jobs: NextPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 jobs">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 bg-clip-padding bg-opacity-60 border border-gray-200">
            <div className="text-7xl">This Section will be live soon :)</div>
            <div className="text-center mt-10">
              <Link href="/">
                <a className="text-4xl text-sky-700 font-medium">Go to Home</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Jobs
