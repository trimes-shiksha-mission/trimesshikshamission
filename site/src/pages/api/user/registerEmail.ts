import bcrypt from 'bcrypt'
import validate from 'deep-email-validator'
import { readFile } from 'fs/promises'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sendMail } from '../../../lib/sendMail'
import { sessionOptions } from '../../../lib/session'

async function registerEmail(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone, password } = req.body
  try {
    const foundUser = await prismaClient.user.findFirst({
      where: {
        contact: phone
      }
    })

    if (!foundUser) {
      return res.status(401).json({ message: 'User not found!' })
    }

    const isValid = await bcrypt.compare(password, foundUser.password || '')

    if(!isValid)
    {
      return res.status(401).json({message:'Wrong password!'})
    }

  const isEmailValid= await validate(email)

  if(!isEmailValid.valid)
  {
    return res.status(404).json({message:'This email address not found,please provide valid email address!'})
  }

    await prismaClient.user.update({
      where: {
        contact: phone
      },
      data: {
        email
      }
    })

    let source = await readFile('template/notApproved.html', 'utf8')

    source = source.replace('[User]', foundUser.name)
    await sendMail({
      to: email,
      subject: 'Thanks for registering',
      html: source
    })
    res.status(200).json({ message: 'User email updated successfully!' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(registerEmail, sessionOptions)
