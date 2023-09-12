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
      title="त्रिमेस शिक्षा मिशन"
      breadcrumbs={[
        {
          label: 'त्रिमेस शिक्षा मिशन'
        },
        {
          label: 'ज्ञान-गंगा मंच'
        }
      ]}
    >
      <Blog type="gyan-ganga" />
    </Layout>
  )
}

export default VidhyaPracharini
