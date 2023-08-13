import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function AreasHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body
    try {
      if (!name) {
        throw new Error('Missing fields')
      }
      await prismaClient.area.create({
        data: {
          name
        }
      })
      res.status(200).json({ message: 'Created' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'GET') {
    try {
      const areas = await prismaClient.area.findMany()
      res.status(200).json(areas)
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  }
}

export default withIronSessionApiRoute(AreasHandler, sessionOptions)
