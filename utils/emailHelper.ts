import nodemailer from 'nodemailer';
import fs from 'fs';
import { logger } from './logger';
import { APP, HOST_SERVER, SENDER_EMAIL, SENDER_PASSWORD} from '../setting'

const TITLE_EMAIL_FORGOT_PASSWORD = `[${APP}] - [FORGOT PASSWORD]`;


export function sendMailTokenResetPassword(receiver: string, username: string, token: string) {
    var htmlTemplate = ``
    fs.readFile('template/password_forgot.html', 'utf8', function (err, contents) {
      if (err) {
        logger('sendMailTokenResetPassword').error(err.message);
        return { status: false, message: err.message }
      } else {
        htmlTemplate = contents
      }
      htmlTemplate = htmlTemplate.replace(/%HOST_SERVER%/gi, HOST_SERVER)
      htmlTemplate = htmlTemplate.replace(/%USERNAME%/gi, receiver)
      htmlTemplate = htmlTemplate.replace(/%ACCOUNT%/gi, username)
      htmlTemplate = htmlTemplate.replace(/%TOKEN%/gi, token)
      sendMail(receiver, TITLE_EMAIL_FORGOT_PASSWORD, htmlTemplate, true)
    });
  }

function sendMail (receiver: string, title: string, body: string, html = false) {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    var mailOptions:any = {
      from: SENDER_EMAIL,
      to: receiver,
      subject: title,
    };
    if (html) {
      mailOptions.html = body
    } else {
      mailOptions.text = body
    }
  
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
           logger('sendMail').error(error.message); 
      } else {
          logger('sendMail').info('Email sent: ' + info.response); 
      }
    });
  }