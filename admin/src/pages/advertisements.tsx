import { GetServerSideProps, NextPage } from 'next'
import { Blog } from '~/components/Blog'
import { Layout } from '~/components/Layout'
import { getServerAuthSession } from '~/server/auth'

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx)
  return {
    redirect: !session
      ? {
          destination: '/auth'
        }
      : session.user.role !== 'SUPERUSER'
      ? {
          destination: '/'
        }
      : undefined,
    props: {}
  }
}
const VidhyaPracharini: NextPage = () => {
  return (
    <Layout
      title="Advertisements"
      breadcrumbs={[
        {
          label: 'Advertisements'
        }
      ]}
    >
      <Blog type="advertisements" />
    </Layout>
  )
}

export default VidhyaPracharini
