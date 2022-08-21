import type { NextPage } from 'next'
import { ProtectedRoute } from '../components/ProtectedRoute'

const Home: NextPage = () => {
  return <ProtectedRoute>Welcome to Trimes Shiksha Mission Admin Panel</ProtectedRoute>
}

export default Home
