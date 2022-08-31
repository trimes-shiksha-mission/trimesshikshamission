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
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' })
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
}
