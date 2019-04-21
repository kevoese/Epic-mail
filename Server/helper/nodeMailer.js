import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper

const resetMail = async (receiverEmail, subjectDetail, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'epicmailteam@gmail.com',
      pass: 'kevo4life',
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

export default resetMail;
