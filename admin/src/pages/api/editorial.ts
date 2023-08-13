import {} from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function EditorialHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined || req.session.user.role !== 'SUPERUSER') {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: 'Unauthorized access!' })
  }

  if (req.method === 'POST') {
    try {
      const { title, body } = req.body
      const editorial = await prismaClient.editorial.create({
        data: {
          title,
          body
        }
      })
      return res.status(200).json(editorial)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  } else if (req.method === 'GET') {
    try {
      const editorial = await prismaClient.editorial.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(editorial)
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      const editorial = await prismaClient.editorial.delete({
        where: {
          id
        }
      })
      return res.status(200).json(editorial)
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error })
    }
  }
}

export default withIronSessionApiRoute(EditorialHandler, sessionOptions)
