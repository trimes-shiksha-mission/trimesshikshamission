import { GetServerSideProps, NextPage } from "next"
import { getServerAuthSession } from '~/server/auth'

export const getServerSideProps: GetServerSideProps = async ctx => {
    const session = await getServerAuthSession(ctx)
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
    return { props: {} }
  }
const viewMatrimonyProfiles: NextPage = () => {

    // Queries
    // const {data: matrimonyProfiles} = api.
  return <>
  
  </>
}
export default viewMatrimonyProfiles
