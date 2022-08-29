import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prismaClient } from '../../../lib/prisma'

declare module 'next-auth' {
  interface Session {
    user?: User
  }
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        contact: {
          label: 'contact',
          type: 'number',
          placeholder: '1234567890'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.contact || !credentials.password) {
          return null
        }
        const foundUser: User | null = await prismaClient.user.findFirst({
          where: {
            contact: credentials.contact
          }
        })
        if (foundUser) {
          const isValid = await bcrypt.compare(
            credentials.password,
            foundUser.password || ''
          )
          if (isValid) {
            return { ...foundUser, password: undefined }
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token, user }) {
      if (token.user) {
        session.user = token.user as User
        session.token = token
      }
      return session
    }
  },
  jwt: {
    maxAge: 1 * 60 * 60 // 1 hour
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, nextAuthOptions)
}
