import { readFile } from 'fs/promises'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sendMail } from '../../../lib/sendMail'
import { sessionOptions } from '../../../lib/session'

async function ApproveUser(req: NextApiRequest, res: NextApiResponse) {
  if (
    req.session.user &&
    ['ADMIN', 'SUPERUSER'].includes(req.session.user.role || '')
  ) {
    if (req.method === 'PATCH') {
      const { id } = req.body
      return await prismaClient.$transaction(
        async prisma => {
          const user = await prisma.user.findFirstOrThrow({
            where: {
              id
            }
          })
          if (user.isVerified) {
            return res.json({
              message: 'User already verified'
            })
          }
          await prisma.user.update({
            where: {
              id
            },
            data: {
              isVerified: true
            }
          })

          if (user && user.email && !user.headId) {
            let source = await readFile('template/approve.html', 'utf8')

            source = source.replace('[User]', user.name)
            await sendMail({
              to: user.email,
              subject: 'Welcome to Trimes',
              html: source
            })
          }
          return res.json(user)
        },
        {
          timeout: 10000,
          isolationLevel: 'Serializable'
        }
      )
    }
  } else {
    res.json({
      isLoggedIn: false,
      message: 'You are not logged in'
    })
  }
}

export default withIronSessionApiRoute(ApproveUser, sessionOptions)
