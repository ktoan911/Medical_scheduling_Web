const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');
const nodemailer = require("nodemailer");

let sendEmail = async (dataSend) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            }
        });

        async function main() {
            const info = await transporter.sendMail({
                from: '"Thuc Skin 👻" <thucskin@gmail.com>',
                to: dataSend.reciverEmail,
                subject: "Thông tin đặt lịch khám bệnh",
                text: "Hello world?",
                html: getBodyHTMLEmail(dataSend),
            });
        }

        await main(); // Call the inner async function

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

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

const sendAttachment = async (dataSend) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_APP,             // Your email address
                pass: process.env.EMAIL_APP_PASSWORD,    // Your email password or app password
            }
        });

        let info = await transporter.sendMail({
            from: '"Thuc Skin 👻" <thucskin@gmail.com>',
            to: dataSend.email,
            subject: "Kết quả đặt lịch khám bệnh",
            html: getBodyHTMLEmailRemedy(dataSend),
            attachments: [
                {
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imageBase64.split("base64,")[1], // Convert base64 to Buffer
                    encoding: 'base64',
                }
            ]
        });

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
                <h3>Xin chào ${dataSend.patientName}</h3>
                    <p>Bạn nhận được email này vì đã khám bệnh thành công trên BookingCare.</p>
                    <p>Bạn có vấn đề phát sinh gì xin liên hệ đến thông tin bác sĩ <b>${dataSend.dt_lastName} ${dataSend.dt_firstName}</b></p>
                    <p>Email: <b>${dataSend.dt_email}</b></p>
                    <p>Địa chỉ: <b>${dataSend.dt_address}</b></p>
                    <p>Số điện thoại: <b>${dataSend.dt_phoneNumber}</b></p>
                    <hr />
                    <p>Thông tin đơn thuốc/hóa đơn được gửi trên file đính kèm.</p>
    
                    <div>Xin cảm ơn.</div>
                `
    }
    if (dataSend.language === 'en') {
        result = `
                <h3>Dear ${dataSend.patientName}</h3>
                    <p>You received this email because of a successful medical examination on BookingCare.</p>
                    <p>If you have any problems, please contact your doctor <b>${dataSend.dt_firstName} ${dataSend.dt_lastName}</b></p>
                    <p>Email: <b>${dataSend.dt_email}</b></p>
                    <p>Address: <b>${dataSend.dt_address}</b></p>
                    <p>Phone number: <b>${dataSend.dt_phoneNumber}</b></p>
                    <hr />
                    <p>Prescription/invoice information is sent on the attached file.</p>
                    <div>Thanks you.</div>
                `
    }
    return result
}

module.exports = {
    sendEmail,
    sendAttachment
}