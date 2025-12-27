import { readFile } from 'fs/promises'
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from '~/env.mjs'
import { supabaseAdmin } from '~/lib/supabase'
import { getServerAuthSession } from '~/server/auth'
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
        // Validate file size: 512KB = 524288 bytes
        if (!f.originalFilename || f.size > 524288) {
          return res.status(400).send({
            message: 'File size must be 512KB or less'
          })
        }
        
        const newFilename = `${Date.now()}-${f.originalFilename}`
        const uploaded = await supabaseAdmin.storage
          .from(env.SUPABASE_BUCKET)
          .upload(type + '/' + newFilename, await readFile(f.filepath))
        
        if (uploaded.data) {
          const url = supabaseAdmin.storage
            .from(env.SUPABASE_BUCKET)
            .getPublicUrl(uploaded.data.path).data.publicUrl
          
          createdAttachments.push({
            url,
            path: uploaded.data.path,
            name: f.originalFilename
          })
        } else if (uploaded.error) {
          return res.status(500).send({
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
