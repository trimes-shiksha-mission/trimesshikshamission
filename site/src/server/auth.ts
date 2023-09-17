import { compare } from 'bcryptjs'
import type { GetServerSidePropsContext } from 'next'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '~/server/db'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      contact: string
      // ...other properties
    } & DefaultSession['user']
  }

  interface User {
    // ...other properties
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        if (user) {
          session.user.id = user.id
          // put other properties on the session here
        }
        if (token?.user) {
          session.user.id = (token.user as { id: string }).id
          // also dont forget to add other properties here
          // session.user.role = (
          //   token.user as { id: string; role: UserRole }
          // ).role

          // handle when user get inactivated
          const u = await prisma.user.findFirst({
            where: {
              id: session.user.id
            },
            select: {
              id: true,
              name: true,
              email: true
            }
          })
          if (!u) throw new Error('Invalid session')
          session.user.name = u.name
          session.user.email = u.email
        }
      }
      return session
    },
    jwt({ token, user }) {
      user && (token.user = user)
      return token
    }
  },
  // comment this below when using credentials provider or disable database persistence
  // adapter: PrismaAdapter(prisma),
  providers: [
    // uncomment this to enable the credentials provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email Mobile',
          type: 'text',
          placeholder: 'Enter mobile'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password'
        }
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await prisma.user.findFirst({
          where: {
            contact: credentials.username
          }
        })

        if (user) {
          if (
            user.password &&
            (await compare(credentials.password, user.password))
          ) {
            if (!user.email) {
              throw new Error('User email not found!')
            }
            if (!user.isVerified) {
              throw new Error('User not verified!')
            }
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              contact: user.contact
            }
          } else {
            throw new Error('Invalid Password')
          }
        } else {
          throw new Error('Invalid User')
        }
      }
    })
    // uncomment this to enable the email provider
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD
    //     }
    //   },
    //   from: process.env.EMAIL_FROM
    // })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  theme: {
    logo: '../../logo.png'
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login'
  },
  session: {
    maxAge: 15 * 60
  }
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
