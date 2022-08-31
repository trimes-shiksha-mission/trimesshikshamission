import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function AllUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' })

  let { filters, page } = req.body
  // console.log(filters)
  page = page > 0 ? page : 1

  const total = await prismaClient.user.count()
  const countToTake = page > total / 5 ? total % 5 : 5
  console.log({ page, total, countToTake })
  const users = await prismaClient.user.findMany({
    skip: (page - 1) * 5,
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

  return res.status(200).json({ users, total })
}
