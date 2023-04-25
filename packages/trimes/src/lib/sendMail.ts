import { createTransport } from 'nodemailer'

type MailOptions = {
  to: string
  subject: string
  html: string
}
const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'trimesshikshamission@gmail.com',
    pass: 'ufulzjadqgmsgsns'
  }
})
export const sendMail = async (mailOptions: MailOptions) => {
  try {
    const sendMail = await transporter.sendMail({
      ...mailOptions,
      from: 'trimesshikshamission@gmail.com'
    })
  
    return sendMail
  } catch (err) {
    throw new Error('Error in sending mail' + err)
  }
}

