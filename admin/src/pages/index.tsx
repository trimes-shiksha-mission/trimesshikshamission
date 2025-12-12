import type { GetServerSideProps, NextPage } from 'next'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
        destination: '/auth'
      }
      : undefined,
    props: {}
  }
}

const Home: NextPage = () => {
  return <Layout breadcrumbs={[{ label: 'Welcome to Trimes Shiksha Mission Admin Panel' }]}>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Trimes Shiksha Mission Admin Panel</h1>
    </div>
  </Layout>
}

export default Home
