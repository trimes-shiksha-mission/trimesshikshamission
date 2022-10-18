import { Blog } from '@prisma/client'
import { NextPage } from 'next'
import Image from 'next/image'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { prismaClient } from '../lib/prisma'

export const getServerSideProps = async () => {
  const students = await prismaClient.blog.findMany({
    where: { type: 'STUDENT' },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (!students.length) {
    return {
      props: {}
    }
  }
  return {
    props: {
      students: students.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt).toLocaleString()
      }))
    }
  }
}

const Students: NextPage<{ students: Blog[] }> = ({ students }) => {
  return (
    <ProtectedRoute>
      {students?.map(n => (
        <div
          key={n.id}
          className="max-w-sm lg:max-w-full lg:flex mt-6 ml-6 mr-6 md:ml-2 lg:ml-12 lg:mr-12 mb-2"
        >
          <div
            className="h-auto lg:w-48 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
            title="news"
          >
            {n.images?.at(0) && (
              <Image
                layout="responsive"
                alt={n.title}
                width={1}
                height={1}
                src={n.images[0]}
              />
            )}
          </div>
          <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b-lg lg:rounded-b-none lg:rounded-r-lg p-4  flex flex-col justify-between leading-normal ">
            <div className="mb-8">
              <p className="text-sm text-gray-600 flex items-center">
                <svg
                  className="fill-current text-gray-500 w-3 h-3 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                </svg>
                Members only
              </p>
              <div className="text-gray-900 font-bold text-xl mb-2">
                {n.title}
              </div>
              <p className="text-gray-700 text-base">{n.body}</p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-900 leading-none">
                  Editor Name / Admin Name
                </p>
                <p className="text-gray-600">{n.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ProtectedRoute>
  )
}
export default Students
