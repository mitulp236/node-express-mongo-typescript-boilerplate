
import * as nodemailer from "nodemailer";
import * as smtpTransport from "nodemailer-smtp-transport";

export const transporter = nodemailer.createTransport(
    smtpTransport( {
        host: process.env.MAIL_HOST,
        port: Number( process.env.MAIL_PORT ) || 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    } ),
);

export interface EmailPayLoad<T> {
    data: T;
    to: string;
}