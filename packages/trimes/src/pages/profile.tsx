import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import Link from 'next/link'

const Profile: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    data: user,
    isLoading: getUserLoading,
    refetch
  } = useQuery('user', async (): Promise<any> => {
    if (!session?.userId) return
    const user = await fetch(`/api/user?id=${session?.userId}`)
    return await user.json()
  })
  useEffect(() => {
    refetch()
  }, [session])
  console.log(user, session)
  if (!session?.userId) {
    // router?.push('/login')
    return <>
    Please Login to Website
    <Link href='/login'>
       Login
    </Link>
    </>
  }
  return <>{JSON.stringify(user)}</>
}

export default Profile
