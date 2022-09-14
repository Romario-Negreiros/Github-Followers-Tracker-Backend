import sgMail from '@sendgrid/mail'
import fs from 'fs'

interface User {
  name: string
  email: string
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const sendEmail = async (user: User) => {
  fs.readFile(`${user.name}-report.pdf`, async (err, data) => {
    if (err) {
      throw err
    }

    const msg: sgMail.MailDataRequired = {
      to: 'valeubeleza72@gmail.com',
      from: 'github.followers.tracker@outlook.com',
      subject: 'Daily report',
      text: 'Here is your github-followers-tracker daily report about your profile followers list changes',
      attachments: [{
        filename: `${user.name}-report.pdf`,
        content: data.toString('base64')
      }]
    }

    await sgMail.send(msg)
  })
}

export default sendEmail
