import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function SchoolHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: 'Unauthorized access!' })
  }

  if (req.method === 'POST') {
    try {
      const { name, address } = req.body
      if (
        !name ||
        !address ||
        !req.session.user ||
        !['ADMIN', 'SUPERUSER'].includes(req.session.user.role as string)
      ) {
        return res
          .status(400)
          .json({ message: 'Bad Request', error: 'Missing name or address' })
      }

      const school = await prismaClient.school.create({
        data: {
          name,
          address,
          createdById: req.session.user.id as string,
          updatedById: req.session.user.id as string
        }
      })
      return res.status(200).json(school)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Some error occured!', error })
    }
  } else if (req.method === 'GET') {
    try {
      const schools = await prismaClient.school.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(schools)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Some error occured!', error })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      if (!id) {
        return res
          .status(400)
          .json({ message: 'Bad Request', error: 'Missing id' })
      }
      const school = await prismaClient.school.delete({
        where: { id }
      })
      return res.status(200).json(school)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Some error occured!', error })
    }
  }
}

export default withIronSessionApiRoute(SchoolHandler, sessionOptions)
