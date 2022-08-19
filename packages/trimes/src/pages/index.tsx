import type { NextPage } from 'next'
import { Header } from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <Header ></Header>
      <div className=" text-white ">
        Tailwind is working if background is red!
      </div>
    </>
  )
}

export default Home
