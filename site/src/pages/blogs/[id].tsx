import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '~/components/Layout'
import { api } from '~/utils/api'

const Blog: NextPage = () => {
  const id = useRouter().query.id as string
  const { data: blog, isLoading: getBlogLoading } = api.blogs.getOne.useQuery(
    id,
    {
      enabled: !!id
    }
  )

  return (
    <Layout loading={getBlogLoading}>
      <div className="flex flex-col px-24 pt-16">
        <h1 className="font-semibold text-xl">{blog?.title}</h1>
        <div
          className="mt-16"
          dangerouslySetInnerHTML={{ __html: blog?.body || '' }}
        ></div>
      </div>
    </Layout>
  )
}

export default Blog
