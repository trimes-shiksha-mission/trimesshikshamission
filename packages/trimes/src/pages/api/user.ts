import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export default async function UserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const values = req.body
    let hashedPassword = ''
    if (values.password) {
      hashedPassword = await bcrypt.hash(values.password, 10)
    } else if (!values.headId) {
      return res.status(400).json({
        error: 'You must provide a headId'
      })
    }
    try {
      Object.keys(values).forEach(k => !values[k] && delete values[k])

      const user = await prismaClient.user.create({
        data: {
          ...values,
          birthday: new Date(values.birthday),
          ...(hashedPassword && { password: hashedPassword })
        }
      })
      res.status(200).json(user)
    } catch (e) {
      res.status(500).json(e)
      console.error(e)
    }
  } else if (req.method === 'GET') {
    try {
      const userId = req.query.id as string
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId
        }
      })
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.status(200).json({
        ...user,
        password: undefined
      })
    } catch (e) {
      res.status(500).json(e)
      console.error(e)
    }
  }
}
