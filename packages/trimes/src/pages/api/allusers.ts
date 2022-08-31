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
  const users = await prismaClient.user.findMany({
    skip: (page - 1) * 10,
    take: total - (page - 1) * 10 > 10 ? 10 : total - (page - 1) * 10
  })

  return res.status(200).json({ users, total })
}
