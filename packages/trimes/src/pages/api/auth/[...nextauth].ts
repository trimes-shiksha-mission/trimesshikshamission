import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prismaClient } from '../../../lib/prisma'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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
        session.user = token.user as any
      }
      return session
    }
  }
})
