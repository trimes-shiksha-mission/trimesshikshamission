import { NextPage } from 'next'
import { Blogs } from '~/components/Blogs'
import { Layout } from '~/components/Layout'

const TSMEducationalInstitue: NextPage = () => {
  return (
    <Layout>
      <Blogs type="vidhya-pracharini" />
    </Layout>
  )
}

export default TSMEducationalInstitue
