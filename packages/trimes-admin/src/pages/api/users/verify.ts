import * as fs from "fs"
import { withIronSessionApiRoute } from 'iron-session/next/dist'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sendMail } from '../../../lib/sendMail'
import { sessionOptions } from '../../../lib/session'

async function ApproveUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user && req.session.user.role === 'ADMIN') {
    if (req.method === 'PATCH') {
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
        let source = fs.readFileSync('/Users/apple/Development/trimesshikshamission/packages/trimes/template/notApproved.html', 'utf8');
       
        source = source.replace("[User]", user.name);
        await sendMail({
          to: user.email,
          subject: 'Welcome to Trimes',
          html: source
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
