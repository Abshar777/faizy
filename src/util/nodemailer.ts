'use server'
import nodemailer from 'nodemailer';


export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD,
        },
    })

    const mailOptions = {
        to,
        subject,
        text,
        html,
    }
    return { transporter, mailOptions }
}