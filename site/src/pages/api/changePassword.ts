import bcrypt from 'bcrypt'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function ChangePasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { password, newPassword } = req.body

  if (!password || !newPassword) {
    return res.status(400).json({ message: 'Missing password or new password' })
  }

  const { user } = req.session
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const userData = await prismaClient.user.findFirst({
    where: {
      id: user.id
    }
  })
  if (!userData?.password) {
    return res.status(401).json({ message: 'User not found' })
  }
  const valid = await bcrypt.compare(password, userData.password)

  if (!valid) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  await prismaClient.user.update({
    where: {
      id: user.id
    },
    data: {
      password: await bcrypt.hash(newPassword, 10)
    }
  })

  res.status(200).json({ message: 'Password changed' })
}

export default withIronSessionApiRoute(ChangePasswordHandler, sessionOptions)
