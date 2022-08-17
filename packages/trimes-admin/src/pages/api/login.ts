import { compare } from 'bcrypt'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions, User } from '../../lib/session'

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, role } = await req.body
  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Please provide correct details'
    })
  }

  try {
    const user = await prismaClient.admin.findFirst({
      where: {
        email: email.toLowerCase(),
        role
      }
    })
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Password is not valid')
    }
    const session = user
    const foundUser = { isLoggedIn: true, ...session } as User
    req.session.user = foundUser
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
