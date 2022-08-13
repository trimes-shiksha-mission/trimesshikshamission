import { Role } from '@prisma/client'
import { NextPage } from 'next'
import useFetch from 'react-fetch-hook'

const Roles: NextPage = () => {
  const { data: roles, isLoading: getRolesLoading } = useFetch<Role[]>(
    '/api/role',
    {
      formatter: async data => (await data.json()).roles
    }
  )

  return getRolesLoading ? (
    <p>Loading...</p>
  ) : (
    <ul>
      {roles?.map(role => (
        <li key={role.id}>{role.name}</li>
      ))}
    </ul>
  )
}

export default Roles
