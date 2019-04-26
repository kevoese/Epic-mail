import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async (receiverEmail, subjectDetail, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'epicmailteam@gmail.com',
      pass: process.env.emailPassword,
    },
  });

  const mailOptions = {
    from: 'epicmailteam@gmail.com', // sender address
    to: receiverEmail, // list of receivers
    subject: subjectDetail, // Subject line
    text: message, // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};
