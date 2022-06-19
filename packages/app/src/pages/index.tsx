import type { GetServerSideProps, NextPage } from 'next'
import { fetchJson } from '../lib/fetchJson'

export const getServerSideProps: GetServerSideProps = async () => {
  const editorials: any = await fetchJson(
    'http://localhost:3000/api/editorial',
    {
      method: 'GET'
    }
  )
  console.log(editorials)

  return {
    props: {
      editorial: editorials?.editorial[0] || null
    }
  }
}

const Home: NextPage<{ editorial: any }> = ({ editorial }) => {
  return (
    <div>
      <span>{new Date(editorial?.createdAt).toLocaleString()}</span>
      <div
        dangerouslySetInnerHTML={{ __html: editorial?.editorialContent }}
      ></div>
    </div>
  )
}

export default Home
