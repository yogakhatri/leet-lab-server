import nodemailer from "nodemailer";
import "dotenv/config";

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.EMAIL_ACCOUNT_USERNAME,
    pass: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(
  senderAddress,
  receiverAddress,
  subject,
  text,
  html = "<h1>Hello</h1>",
) {
  // send mail with defined transport object
  const info = await transport.sendMail({
    from: senderAddress,
    to: receiverAddress, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
  console.log("Message sent: %s", info.messageId);
}
