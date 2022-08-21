import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function UserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const values = req.body
    const hashedPassword = await bcrypt.hash(values.password, 10)
    try {
      const user = await prismaClient.user.create({
        data: {
          ...values,
          birthday: new Date(values.birthday),
          password: hashedPassword
        }
      })
      res.status(200).json(user)
    } catch (e) {
      res.status(500).json(e)
      console.error(e)
    }
  }
}
