import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'

export interface filters {
  qualification: string[]
  occupation: string[]
  gautra: string[]
}

export default async function filterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const { qualification, occupation, gautra, name, gender } = req.body
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
      }
    })

    return res.status(200).json(filteredUsers)
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}
