import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function AreaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const areas = await prismaClient.area.findMany()
    res.status(200).json(areas)
  } else {
    res.status(405).json({
      message: 'Method not allowed'
    })
  }
}
