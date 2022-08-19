import type { NextPage } from 'next'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Home: NextPage = () => {
  return <ProtectedRoute>hello world</ProtectedRoute>
}

export default Home
