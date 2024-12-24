import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html }: Params) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // plain text body
  });
};
