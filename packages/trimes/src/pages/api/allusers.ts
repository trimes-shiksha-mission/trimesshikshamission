import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function AllUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) return 'User not logged in'
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' })

  const pageSize = 10
  let { page } = req.body

  page = page > 0 ? page : 1

  const totalHeads = await prismaClient.user.count({ where: { headId: null } })
  const countToTake =
    page > totalHeads / pageSize ? totalHeads % pageSize : pageSize

  const totalUsers = await prismaClient.user.count()
  const heads = await prismaClient.user.findMany({
    skip: (page - 1) * pageSize,
    take: countToTake,
    where: {
      headId: null
    },
    include: {
      members: true,
      area: {
        select: {
          name: true
        }
      }
    }
  })

  return res.status(200).json({ heads, totalHeads, totalUsers })
}

export default withIronSessionApiRoute(AllUserHandler, sessionOptions)
