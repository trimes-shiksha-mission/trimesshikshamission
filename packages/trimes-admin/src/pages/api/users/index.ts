import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sessionOptions } from '../../../lib/session'

async function Users(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    if (req.method === 'GET') {
<<<<<<< Updated upstream
      const whereUserQuery: { isVerified?: boolean } = {}

      if (req.query.approved === 'true') {
        whereUserQuery.isVerified = false
      }
      const users = await prismaClient.user.findMany({
        where: whereUserQuery,
=======
      const users = await prismaClient.user.findMany({
>>>>>>> Stashed changes
        include: {
          area: true,
          head: true
        }
      })
      return res.json(
        users.map(user => ({
          ...user,
          password: undefined
        }))
      )
    } else if (req.method === 'DELETE') {
      const { id } = req.body
      const user = await prismaClient.user.delete({
        where: {
          id
        }
      })
      return res.json(user)
    }
  } else {
    res.json({
      isLoggedIn: false,
      message: 'You are not logged in'
    })
  }
}

export default withIronSessionApiRoute(Users, sessionOptions)
