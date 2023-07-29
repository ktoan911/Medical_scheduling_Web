const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');
const emailService = require('./emailService');

let postBookAppointment = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.timeType || !data.date) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            await emailService.sendEmail({
                reciverEmail: data.email,
                patientName: 'Thuc Skin vip',
                time: '10:00 AM - Chủ nhật',
                doctorName: 'ThucSkin',
                redirectLink: 'https://www.youtube.com/watch?v=0GL--Adfqhc&list=PLncHg6Kn2JT6E38Z3kit9Hnif1xC_9VqI&index=97'
            })

            //upsert 
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'role_patient'
                }
            })
            //creare data booking
            if (user[0] && user) {
                await db.Booking.findOrCreate({
                    where: { date: data.date },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType
                    }
                })
            }
            return {
                errCode: 0,
                message: 'OK',
            }
        }
    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}



module.exports = {
    postBookAppointment
}