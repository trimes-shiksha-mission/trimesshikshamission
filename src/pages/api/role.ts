import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST')
    return res.status(405).send({ message: 'Method not allowed' })
  if (req.method === 'GET') {
    const roles = await prismaClient.role.findMany()
    return res.status(200).json({ roles })
  }
  if (req.method === 'POST') {
    const { name } = req.body
    try {
      const role = await prismaClient.role.create({
        data: {
          name
        }
      })
      return res.status(200).send({ role })
    } catch (error) {
      return res.status(500).send({ error })
    }
  }
}
