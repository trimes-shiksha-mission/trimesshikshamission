import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'

export interface filters {
  qualification: string[]
  occupation: string[]
  gautra: string[]
}

async function filterHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) return 'User not logged in'
  if (req.method === 'GET') {
    const distinctValues = await prismaClient.user.findMany({
      distinct: ['qualification', 'occupation', 'gautra']
    })

    const filters: filters = {
      qualification: [],
      occupation: [],
      gautra: []
    }
    distinctValues.forEach(item => {
      if (item.qualification) {
        filters.qualification.push(item.qualification)
      }
      if (item.occupation) {
        filters.occupation.push(item.occupation)
      }
      if (item.gautra) {
        filters.gautra.push(item.gautra)
      }
    })

    filters.qualification = [...new Set(filters.qualification)]
    filters.occupation = [...new Set(filters.occupation)]
    filters.gautra = [...new Set(filters.gautra)]

    return res.status(200).json(filters)
  } else if (req.method === 'POST') {
    const { qualification, occupation, gautra, name, gender, currPage } =
      req.body

    const count = await prismaClient.user.count({
      where: {
        ...(qualification && {
          qualification: {
            search: qualification.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(occupation && {
          occupation: {
            search: occupation.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(gautra && {
          gautra: {
            search: gautra.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(name && {
          name: {
            search: name.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(gender && { gender })
      }
    })
    const filteredUsers = await prismaClient.user.findMany({
      where: {
        ...(qualification && {
          qualification: {
            search: qualification.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(occupation && {
          occupation: {
            search: occupation.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(gautra && {
          gautra: {
            search: gautra.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(name && {
          name: {
            search: name.toLowerCase().trim().split(' ').join('|')
          }
        }),
        ...(gender && { gender })
      },
      include: {
        head: {
          select: {
            name: true
          }
        }
      },
      take: 10,
      skip: (currPage < 1 ? 0 : currPage - 1) * 10
    })

    return res.status(200).json({ filteredUsers, count })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withIronSessionApiRoute(filterHandler, sessionOptions)
