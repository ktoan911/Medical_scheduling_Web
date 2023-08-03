const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');
const nodemailer = require("nodemailer");

let sendEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Thuc Skin 👻" <thucskin@gmail.com>', // sender address
            to: dataSend.reciverEmail, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh", // Subject line
            text: "Hello world?", // plain text body
            html: getBodyHTMLEmail(dataSend), //
        });
    }
    let getBodyHTMLEmail = (dataSend) => {
        let result = '';
        if (dataSend.language === 'vi') {
            result = `
            <h3>Xin chào ${dataSend.patientName}</h3>
                <p>Bạn đã yêu cầu đặt lịch khám bệnh</p>
                <p>Thông tin đặt lịch khám bệnh:</p>
                <div><b>Thời gian: ${dataSend.time}</b></div>
                <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
                <hr />
                <p>Vui lòng nhấn vào link bên dưới để xác thực thông tin!</p>
                <div><a href="${dataSend.redirectLink}" target="_blank">Nhấn vào đây!</a></div>
                <div>Xin cảm ơn.</div>
            `
        }
        if (dataSend.language === 'en') {
            result = `
            <h3>Dear ${dataSend.patientName}</h3>
                <p>You have requested to book a medical appointment</p>
                <p>Information to book a medical appointment:</p>
                <div><b>Time: ${dataSend.time}</b></div>
                <div><b>Doctor: ${dataSend.doctorName}</b></div>
                <hr />
                <p>Please click on the link below to verify the information!</p>
                <div><a href="${dataSend.redirectLink} target="_blank">Click here!</a></div>
                <div>Thanks you.</div>
            `
        }
        return result;
    }


    main().catch(console.error);
}

module.exports = {
    sendEmail
}