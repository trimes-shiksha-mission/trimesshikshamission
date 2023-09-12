import Image from 'next/image'
import Link from 'next/link'
import { FC, useState } from 'react'
import { api } from '~/utils/api'

export const Blogs: FC<{
  type: string
}> = ({ type }) => {
  const [variables, setVariables] = useState({
    page: 1,
    limit: 10
  })

  const { data: blogs, isLoading: getBlogsLoading } = api.blogs.getAll.useQuery(
    {
      type,
      ...variables
    }
  )

  return (
    <>
      {/* Paginated blogs display page where blog image and title is shown in list side by side */}

      {/* On clicking on any blog, it should open a new page where blog is shown in detail with all the content */}
      {blogs?.blogs.map(item => (
        <Link
          key={item.id}
          href={`/blogs/${item.id}`}
          className="flex px-24 gap-24 mt-24"
        >
          {item.body.includes('<img') ? (
            <div className="w-1/3 relative">
              <Image
                src={
                  item.body.split('src="')[1]?.split('"')[0] ||
                  '/images/placeholder.png'
                }
                alt={item.title}
                layout="responsive"
                width={1}
                height={1}
              />
            </div>
          ) : (
            <div className="w-1/3 relative">
              <Image
                src="/images/placeholder.png"
                alt={item.title}
                layout="responsive"
              />
            </div>
          )}
          <div className="">
            <h2 className="font-semibold">{item.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: item.body.replace(/<img[^>]*>/g, '').substring(0, 100)
              }}
            ></div>
          </div>
        </Link>
      ))}

      {/* Pagination if blogs count > 10 */}
      <div>
        {/* Show from and to count */}
        <div className="flex justify-center items-center mt-24">
          <p>
            Showing{' '}
            {blogs?.blogs.length
              ? variables.page * variables.limit - variables.limit + 1
              : 0}{' '}
            to {variables.page * (blogs?.blogs.length || 0)} of{' '}
            {blogs?.count || 0} blogs
          </p>
        </div>
        <div className="flex justify-center gap-4 items-center mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              setVariables({
                ...variables,
                page: variables.page - 1
              })
            }
            disabled={variables.page === 1}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              setVariables({
                ...variables,
                page: variables.page + 1
              })
            }
            disabled={
              getBlogsLoading ||
              variables.limit * variables.page >= (blogs?.count || 0)
            }
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
