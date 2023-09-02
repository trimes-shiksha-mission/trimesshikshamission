import { Fields, Files, IncomingForm } from 'formidable'
import { NextApiRequest } from 'next'

export const parseMultipartRequest = (req: NextApiRequest) =>
  new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)

      if (fields) {
        Object.keys(fields).forEach(key => {
          if (
            fields[key] &&
            Array.isArray(fields[key]) &&
            fields[key]!.length === 1
          ) {
            ;(fields as any)[key]! = fields[key]![0] as any
          }
        })
      }

      return resolve({
        fields,
        files
      })
    })
  })
