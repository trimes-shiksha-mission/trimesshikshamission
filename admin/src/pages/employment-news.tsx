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
      : undefined,
    props: {}
  }
}

const VidhyaPracharini: NextPage = () => {
  return (
    <Layout
      title="Employment News"
      breadcrumbs={[
        {
          label: 'Employment News'
        }
      ]}
    >
      <Blog type="employment-news" />
    </Layout>
  )
}

export default VidhyaPracharini
