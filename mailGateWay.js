"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '', // generated ethereal user
        pass: '', // generated ethereal password
    },
});
// { subject: "appointment cancelled", text: "sorry, your appoitnment is cancelled" }
const sendMail = async (recipents, message) => {
    const res = await transporter.sendMail({ from: "myEducation", to: recipents.join(", "), ...message, })
    console.log(res)
}


module.exports = { sendMail }