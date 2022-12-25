import { User } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../lib/session'

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User | null>) {
  req.session.destroy()
  res.redirect('/')
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
