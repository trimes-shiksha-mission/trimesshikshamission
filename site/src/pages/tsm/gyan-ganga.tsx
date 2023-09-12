import { NextPage } from 'next'
import { Blogs } from '~/components/Blogs'
import { Layout } from '~/components/Layout'

const GyanGanga: NextPage = () => {
  return (
    <Layout>
      <Blogs type="gyan-ganga" />
    </Layout>
  )
}

export default GyanGanga
