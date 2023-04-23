import { withIronSessionApiRoute } from 'iron-session/next/dist'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sendMail } from '../../../lib/sendMail'
import { sessionOptions } from '../../../lib/session'

async function ApproveUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user && req.session.user.role === 'ADMIN') {
    if (req.method === 'PUT') {
      const { id } = req.body

      const user = await prismaClient.user.update({
        where: {
          id
        },
        data: {
          isVerified: true
        }
      })

      if (user && user.email && !user.headId) {
        await sendMail({
          to: user.email,
          subject: 'Your account has been approved',
          text: 'Your account has been approved'
        })
      }
      return res.json(user)
    }
  } else {
    res.json({
      isLoggedIn: false,
      message: 'You are not logged in'
    })
  }
}

export default withIronSessionApiRoute(ApproveUser, sessionOptions)
