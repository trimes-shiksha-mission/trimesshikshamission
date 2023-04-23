import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sendMail } from '../../lib/sendMail'

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
      if (values.email) {
        const found = await prismaClient.user.count({
          where: {
            email: values.email
          }
        })
        if (found)
          return res.status(200).json({
            error: 'Email already exists'
          })
      }
      if (values.contact) {
        const found = await prismaClient.user.count({
          where: {
            contact: values.contact
          }
        })
        if (found)
          return res.status(200).json({
            error: 'Contact already exists'
          })
      }
      const user = await prismaClient.user.create({
        data: {
          ...values,
          birthday: new Date(values.birthday),
          ...(hashedPassword && { password: hashedPassword })
        }
      })

      if (user && !user.headId && user.email) {
        await sendMail({
          to: user.email,
          subject: 'Welcome to Trimes',
          text: 'Welcome to Trimes'
        })
      }
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
        },
        include: {
          area: {
            select: {
              name: true
            }
          }
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
  } else if (req.method === 'PUT') {
    const values = req.body
    const userId = values.userId
    delete values.userId

    try {
      Object.keys(values).forEach(k => !values[k] && delete values[k])
      const user = await prismaClient.user.update({
        where: {
          id: userId
        },
        data: {
          ...values,
          birthday: new Date(values.birthday)
        }
      })
      res.status(200).json(user)
    } catch (e) {
      res.status(500).json(e)
      console.error(e)
    }
  } else if (req.method === 'DELETE') {
    const userId = req.query.id as string
    try {
      const user = await prismaClient.user.delete({
        where: {
          id: userId
        }
      })
      res.status(200).json(user)
    } catch (e) {
      res.status(500).json(e)
      console.error(e)
    }
  }
}
