import { hash } from 'bcrypt'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

async function EditorsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: 'Unauthorized access!' })
  }
  if (req.method === 'POST') {
    if (!['ADMIN', 'SUPERADMIN'].includes(req.session.user.role || '')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized', error: 'Unauthorized access!' })
    }
    try {
      const { email, password, name, areaId } = req.body
      if (!email || !password || !name || !areaId) {
        throw new Error('Missing fields')
      }
      const hashedPassword = await hash(password, 10)
      await prismaClient.admin.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'EDITOR',
          areaId,
          createdById: req.session.user.id,
          updatedById: req.session.user.id
        }
      })

      res.status(200).json({ message: 'Created' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'GET') {
    try {
      const editors = await prismaClient.admin.findMany({
        where: {
          role: 'EDITOR'
        },
        include: {
          area: true,
          createdBy: {
            select: {
              name: true
            }
          },
          updatedBy: {
            select: {
              name: true
            }
          }
        }
      })
      res
        .status(200)
        .json(
          editors
            .map(editor => ({ ...editor, password: undefined }))
            .filter(editor => editor.id !== req.session.user?.id)
        )
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, name, areaId, password, email } = req.body

      if (!id || !name || !areaId || !email) {
        throw new Error('Missing fields')
      }
      let hashedPassword = undefined
      if (password) {
        hashedPassword = await hash(password, 10)
      }
      await prismaClient.admin.update({
        where: {
          id
        },
        data: {
          name,
          areaId,
          ...(hashedPassword && { password: hashedPassword }),
          email,
          updatedById: req.session.user.id
        }
      })

      res.status(200).json({ message: 'Updated' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      if (!id) {
        throw new Error('Missing fields')
      }
      await prismaClient.admin.delete({
        where: {
          id: id
        }
      })
      res.status(200).json({ message: 'Deleted' })
    } catch (error) {
      console.error(error)
      throw new Error('Some error occured!')
    }
  }
}

export default withIronSessionApiRoute(EditorsHandler, sessionOptions)
