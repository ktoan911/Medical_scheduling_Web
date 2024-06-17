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
        if (!data.email || !data.doctorId || !data.timeType || !data.date
            || !data.fullName || !data.selectedGender || !data.address
            || !data.phoneNumber) {
            return {
                errCode: 1,
                message: 'Missing required parameters!',
            }
        } else {
            let token = uuidv4();

            // Send verification email
            await emailService.sendEmail({
                reciverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            });

            // Find or create user (patient)
            let [user, created] = await db.BenhNhan.findOrCreate({
                where: { email: data.email },
                defaults: {
                    username: data.email, // Example: Use email as username
                    password: 'default_password', // Example: Provide a default password
                    namSinh: data.birthYear, // Example: Provide birthYear from data
                    diaChi: data.address,
                    SDT: data.phoneNumber,
                    gioiTinh: data.selectedGender,
                    hoten: data.fullName,
                    email: data.email
                }
            });

            // Find doctor and time slot (CaKham)
            let doctor = await db.BacSi.findOne({
                where: { IDBacSi: data.doctorId }
            });
            let timeSlot = await db.CaKham.findOne({
                where: { IDCa: data.timeType }
            });

            // Create booking record
            if (user && doctor && timeSlot) {
                await db.LichDat.create({
                    IDBacSi: data.doctorId,
                    IDBenhNhan: user.IDBenhNhan,
                    IDDichVu: data.serviceId, // Example: Provide serviceId from data
                    IDCa: data.timeType,
                    NgayDatLich: data.date,
                    TrangThai: 1, // Example: Set default status
                    TinhTrangThanhToan: 0, // Example: Set default payment status
                    ThuDatLich: null // Example: Set weekday if needed
                });
            }

            return {
                errCode: 0,
                message: 'OK',
            }
        }
    } catch (error) {
        console.error(error);
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
                message: 'Missing required parameters!',
            }
        } else {
            let appointment = await db.LichDat.findOne({
                where: {
                    IDBacSi: data.doctorId,
                    token: data.token,
                    TrangThai: 1 // Example: Only find appointments with status 'S1'
                },
                include: [
                    { model: db.BenhNhan, as: 'benhnhan' }
                ]
            });

            if (appointment) {
                appointment.TrangThai = 2; // Update status to 'S2'
                await appointment.save();
            }

            return {
                errCode: 0,
                message: 'Updated appointment successfully!',
                data: appointment
            }
        }
    } catch (error) {
        console.error(error);
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