const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');
const emailService = require('./emailService');
const { v4: uuidv4 } = require('uuid');

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            let token = uuidv4();

            await emailService.sendEmail({
                reciverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
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
                        timeType: data.timeType,
                        token: token
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

let postVerifyBookAppointmentService = async (data) => {
    try {
        if (!data.token || !data.doctorId) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                },
                raw: false  // object of resquelize || raw = true: object JavaScript
            })
            if (appointment) {
                appointment.statusId = 'S2',
                    await appointment.save();
            }

            return {
                errCode: 0,
                message: 'Updated appointment successfully!',
                data: appointment
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
    postBookAppointment,
    postVerifyBookAppointmentService
}