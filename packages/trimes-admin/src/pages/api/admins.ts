import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function AdminHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        .json(admins.map(admin => ({ ...admin, password: undefined })))
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  }
}
