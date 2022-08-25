import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prismaClient } from '../../../lib/prisma'

declare module 'next-auth' {
  interface Session {
    user?: User
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
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
        // console.log(credentials)
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
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User
      }
      return session
    }
  }
})
