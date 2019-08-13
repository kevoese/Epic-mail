import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'epicmailteam@gmail.com',
    pass: process.env.emailPassword,
  },
});

export const resetMailer = async (receiverEmail, subjectDetail, message) => {
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
