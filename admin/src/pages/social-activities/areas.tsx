import { NextPage } from 'next'
import { Blog } from '~/components/Blog'
import { Layout } from '~/components/Layout'

const VidhyaPracharini: NextPage = () => {
  return (
    <Layout
      title="Social Activities"
      breadcrumbs={[
        {
          label: 'Social Activities'
        },
        {
          label: 'चोखलों से'
        }
      ]}
    >
      <Blog type="areas" />
    </Layout>
  )
}

export default VidhyaPracharini
