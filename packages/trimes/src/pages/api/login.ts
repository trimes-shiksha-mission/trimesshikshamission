import bcrypt from 'bcrypt'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const {contact, password } =  req.body

  try {
    //get login info from db
    const foundUser = await prismaClient.user.findFirst({
      where: {
        contact: contact
      }
    })
    if (foundUser) {

      if(foundUser.email)
      {
        return res.status(401).json({ message:  'User email not found!' })
       
      }
      
      if (!foundUser.isVerified) {
        return res.status(401).json({ message: 'User not verified!' })
      }
      const isValid = await bcrypt.compare(password, foundUser.password || '')
      if (isValid) {
        const user = {
          ...foundUser,
          password: null
        }
        req.session.user = user
        await req.session.save()
        return res.json(user)
      } else {
        return res.status(401).json({ message: 'Wrong Password!' })
      }
    } else {
      req.session.destroy()
      return res.status(401).json({ message: 'User not found!' })
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
