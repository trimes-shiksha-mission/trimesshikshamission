import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

export type IUser = {
  isLoggedIn: boolean
  name: string
  id: string
}

async function userRoute(req: NextApiRequest, res: NextApiResponse<IUser>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    const found = await prismaClient.user.count({
      where: {
        id: req.session.user.id
      }
    })
    if (!found)
      return res.json({
        isLoggedIn: false,
        name: '',
        id: ''
      })
    res.json({
      ...req.session.user,
      isLoggedIn: true
    })
  } else {
    res.json({
      isLoggedIn: false,
      name: '',
      id: ''
    })
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions)
