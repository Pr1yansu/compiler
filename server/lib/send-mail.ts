import nodemailer from "nodemailer";

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE!,
    auth: {
      user: process.env.EMAIL!,
      pass: process.env.PASSWORD!,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL!,
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error occurs", err);
    } else {
      console.log("Email sent!!!");
    }
  });
};
