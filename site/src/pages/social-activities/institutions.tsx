import { GetServerSideProps, NextPage } from 'next'
import { Blogs } from '~/components/Blogs'
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

const Institutions: NextPage = () => {
  return (
    <Layout>
      <Blogs type="institutions" />
    </Layout>
  )
}

export default Institutions
