import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

async function forgetPassword(req: NextApiRequest, res:NextApiResponse) {
const {email}= req.body

const user = await prismaClient.user.findFirst({
  where:{
    email
  }
})

if(!user)
{
  return res.status(400).json({message:'User not exist!'})
}



}

export default withIronSessionApiRoute(forgetPassword,sessionOptions)