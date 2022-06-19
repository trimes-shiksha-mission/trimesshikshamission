import type { NextPage } from 'next'

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
