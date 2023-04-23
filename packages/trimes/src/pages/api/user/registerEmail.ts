import * as fs from "fs"
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../../lib/prisma'
import { sendMail } from '../../../lib/sendMail'
import { sessionOptions } from '../../../lib/session'



async function registerEmail(req: NextApiRequest,res: NextApiResponse)
{
  const {email,contact, password } =  req.body
  try{
    const foundUser = await prismaClient.user.findFirst({
      where: {
        contact: contact
      }
    })

    if(!foundUser)
    {
      return res.status(401).json({ message: 'User not found!' })
    }
    
    await prismaClient.user.update({
      where:{
        contact
      },
      data:{
        email
      }
    })

    let source = fs.readFileSync('../../template/notApproved.html', 'utf8');
    console.log(source)
    source = source.replace("[User]", foundUser.name);
    await sendMail({
      to: email,
      subject:'Thanks for registering',
      html:source
    })
    res.status(200).json({message:'User email updated successfully!'})

  }catch(error)
  {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(registerEmail, sessionOptions)