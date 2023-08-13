import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function MemberHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const headId = req.query.headId as string
    if (!headId) return
    const members = await prismaClient.user.findMany({
      where: {
        headId
      }
    })

    res.status(200).json(members)
  } else if (req.method === 'DELETE') {
    const memberId = req.query.memberId as string
    if (!memberId) return
    const deletedMember = await prismaClient.user.delete({
      where: {
        id: memberId
      }
    })
    res.status(200).json(deletedMember)
  }
}
