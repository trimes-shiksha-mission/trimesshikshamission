import { readFile } from 'fs/promises'
import { withIronSessionApiRoute } from 'iron-session/next'
import { Form } from 'multiparty'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '../../lib/prisma'
import { sessionOptions } from '../../lib/session'
import { supabaseClient } from '../../lib/supabase'

export const config = {
  api: {
    bodyParser: false
  }
}

const parseForm = (req: NextApiRequest): Promise<{ body: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = new Form()
    form.parse(req, async (err, body, files) => {
      if (err) return reject(err)
      return resolve({ body, files })
    })
  })

async function BlogHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const bucket = process.env.SUPABASE_BUCKET
  const supabaseBucketURL = process.env.SUPABASE_URL
  if (!bucket || !supabaseBucketURL) {
    return res.status(500).json({ message: 'Missing Bucket OR URL' })
  }

  if (req.method === 'GET') {
    const type = req.query.type as string
    if (!type) {
      return res.status(400).json({ message: 'Missing type' })
    }
    const blogs = await prismaClient.blog.findMany({
      where: {
        type
      },
      include: {
        createdBy: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json(blogs)
  } else if (req.method === 'POST') {
    const { body, files } = await parseForm(req)
    const { title, body: blogBody } = body
    if (!title || !body)
      return res.status(400).json({ message: 'Invalid request' })
    const fileUrls: string[] = []
    for (let i = 0; i < files.files.length; i++) {
      const file = files.files[i]

      const path = `${Date.now()}-news-${file.originalFilename}`
      const fileData = await readFile(file.path)
      const url = await supabaseClient.storage
        .from(bucket)
        .upload(path, fileData, {
          contentType: file.headers['content-type']
        })
      if (url.data?.Key) {
        fileUrls.push(url.data.Key)
      }
    }
    await prismaClient.blog.create({
      data: {
        body: blogBody[0],
        title: title[0],
        type: 'NEWS',
        createdById: req.session.user.id,
        images: fileUrls.map(
          url => supabaseBucketURL + '/storage/v1/object/public/' + url
        )
      }
    })
    return res.status(200).json({ message: 'OK' })
  } else if (req.method === 'DELETE') {
    const id = req.query.id as string
    if (!id) {
      return res.status(400).json({ message: 'Missing id' })
    }

    const blog = await prismaClient.blog.delete({
      where: {
        id
      }
    })
    if (blog.images.length) {
      const toDelete = blog.images.map(url =>
        url.replace(
          supabaseBucketURL + '/storage/v1/object/public/trimes-shiksha/',
          ''
        )
      )
      await supabaseClient.storage.from(bucket).remove(toDelete)
    }
    return res.status(200).json({ message: 'OK' })
  }
}

export default withIronSessionApiRoute(BlogHandler, sessionOptions)
