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
      title="Social Activities"
      breadcrumbs={[
        {
          label: 'Social Activities'
        },
        {
          label: 'पंजीकृत संस्थाएं'
        }
      ]}
    >
      <Blog type="institutions" />
    </Layout>
  )
}

export default VidhyaPracharini
