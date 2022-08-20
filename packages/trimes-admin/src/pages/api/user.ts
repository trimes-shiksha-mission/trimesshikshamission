import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions, User } from '../../lib/session'

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    const user = await prismaClient.admin.findFirst({
      where: { id: req.session.user.id }
    })
    if (!user) {
      return res.json({ isLoggedIn: false })
    }
    return res.json({
      ...req.session.user,
      isLoggedIn: true,
      password: undefined
    })
  } else {
    res.json({
      isLoggedIn: false
    })
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions)
