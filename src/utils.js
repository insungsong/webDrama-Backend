import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import "./env";

//secret Random Number Create
export const secretKey = Math.floor(Math.random() * 1000000);

const sendMail = (email) => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };

  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email, function(error, info) {
    if (error) {
      console.log(error);
    }
    if (info) {
      console.log(info);
    }
  });
};

export const sendSecretMail = (address, secret) => {
  const email = {
    from: "weberydayofficial@gmail.com",
    to: address,
    subject: "🔒Login Secret for Weberyday 🔒",
    html: `Hello! Your login secret is <b>${secret}</b><br/>Copy paste on the app/website to log in`
  };
  return sendMail(email);
};
