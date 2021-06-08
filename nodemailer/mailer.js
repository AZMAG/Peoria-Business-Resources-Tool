"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function mainMail() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail",
        port: 25,
        secure: false, // true for 465, false for other ports
    });

    // send mail with defined transport object
    let mailOptions = await transporter.sendMail({
        from: "mail@azmag.gov", // sender address
        to: "Susana.Trasente@peoriaaz.gov, Karen.Calivas@peoriaaz.gov", // list of receivers
        subject: "New Business Info Added", // Subject line
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", mailOptions.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailOptions));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

mainMail().catch(console.error);

// Info
// https://nodemailer.com/about/
// https://www.w3schools.com/nodejs/nodejs_email.asp
