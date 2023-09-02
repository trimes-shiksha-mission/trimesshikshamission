import { readFile } from 'fs/promises'
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from '~/env.mjs'
import { supabaseClient } from '~/lib/supabase'
import { getServerAuthSession } from '~/server/auth'
import { prisma } from '~/server/db'
import { parseMultipartRequest } from '~/utils/parseMultipartRequest'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).send({
      message: 'Method not allowed'
    })

  const session = await getServerAuthSession({
    req,
    res
  })

  if (!session)
    return res.status(401).send({
      message: 'Unauthorized'
    })

  const { files, fields } = await parseMultipartRequest(req)
  const { type } = fields as any

  const createdAttachments: any[] = []

  for (const key in files) {
    const file = files[key]

    if (!file) continue
    if (Array.isArray(file)) {
      for (const f of file) {
        if (!f.originalFilename || f.size > 26214400) continue
        const newFilename = `${Date.now()}-${f.originalFilename}`
        const uploaded = await supabaseClient.storage
          .from(env.SUPABASE_BUCKET)
          .upload(type + '/' + newFilename, await readFile(f.filepath))
        console.log(uploaded)
        if (uploaded.data) {
          const a = await prisma.resource.create({
            data: {
              name: f.originalFilename,
              url: supabaseClient.storage
                .from(env.SUPABASE_BUCKET)
                .getPublicUrl(uploaded.data.path).data.publicUrl,
              type,
              path: uploaded.data.path
            }
          })
          createdAttachments.push(a)
        } else if (uploaded.error) {
          res.status(500).send({
            message: uploaded.error.message
          })
        }
      }
    }
  }

  return res.send({
    attachments: createdAttachments
  })
}
