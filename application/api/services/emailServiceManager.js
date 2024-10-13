import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
sgMail.setApiKey(SENDGRID_API_KEY)

const emailQueue = []

const sendEmail = async (email, subject, text) => {
  try {
    const msg = {
      to: email,
      from: 'mytravelwise2024@hotmail.com',
      subject,
      text
    }
    await sgMail.send(msg)
    console.log('Email sent to', email)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

const processQueue = async () => {
  while (emailQueue.length > 0) {
    const job = emailQueue.shift()
    await sendEmail(job.email, job.subject, job.text)
  }
}

const enqueueEmailJob = (email, subject, text) => {
  emailQueue.push({ email, subject, text })
  console.log('Email job enqueued for', email)
  processQueue()
}

export const emailServiceManager = {
  sendEmail: enqueueEmailJob,
  sgMail
}
