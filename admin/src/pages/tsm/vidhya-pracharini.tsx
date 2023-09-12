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
      title="Vidhya Pracharini Sabha"
      breadcrumbs={[
        {
          label: 'त्रिमेस शिक्षा मिशन'
        },
        {
          label: 'त्रिमेस विद्या प्रचारिणी संस्थान'
        }
      ]}
    >
      <Blog type="vidhya-pracharini" />
    </Layout>
  )
}

export default VidhyaPracharini
