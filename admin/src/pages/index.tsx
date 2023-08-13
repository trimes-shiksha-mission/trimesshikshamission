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
  return <Layout>Welcome to Trimes Shiksha Mission Admin Panel</Layout>
}

export default Home
