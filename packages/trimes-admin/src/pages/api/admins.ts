import { hash } from 'bcrypt'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'
async function AdminHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    res
      .status(401)
      .json({ message: 'Unauthorized', error: 'Unauthorized access' })
    throw new Error('Unauthorized')
  }
  if (req.method === 'POST') {
    try {
      const { email, password, name } = req.body
      if (!email || !password || !name) {
        throw new Error('Missing fields')
      }
      const hashedPassword = await hash(password, 10)
      await prismaClient.admin.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'ADMIN'
        }
      })

      res.status(200).json({ message: 'Created' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'GET') {
    try {
      const admins = await prismaClient.admin.findMany({
        where: {
          role: 'ADMIN'
        }
      })
      res
        .status(200)
        .json(
          admins
            .map(admin => ({ ...admin, password: undefined }))
            .filter(admin => admin.id !== req.session.user?.id)
        )
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, name, password, email } = req.body

      if (!id || !name || !email) {
        throw new Error('Missing fields')
      }
      let hashedPassword = undefined
      if (password) {
        hashedPassword = await hash(password, 10)
      }
      await prismaClient.admin.update({
        where: {
          id
        },
        data: {
          name,
          ...(hashedPassword && { password: hashedPassword }),
          email
        }
      })

      res.status(200).json({ message: 'Updated' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      if (!id) {
        throw new Error('Missing fields')
      }
      await prismaClient.admin.delete({
        where: {
          id: id
        }
      })
      res.status(200).json({ message: 'Deleted' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  }
}

export default withIronSessionApiRoute(AdminHandler, sessionOptions)
