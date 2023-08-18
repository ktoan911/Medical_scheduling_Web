const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');

let createClinic = async (data) => {
    try {
        if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                message: 'Missing required parameters!',
            }
        } else {
            await db.Clinic.create({
                name: data.name,
                address: data.address,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            })

            //     //upsert to doctor_infor table
            // let clinicDetail = await db.Clinic.findOne({
            //     where: { doctorId: inputData.doctorId },
            //     raw: false,
            // })
            // if (doctorInfor) {
            //     //update
            //     doctorInfor.doctorId = inputData.doctorId;
            //     doctorInfor.priceId = inputData.selectedPrice;
            //     doctorInfor.provinceId = inputData.selectedProvince;
            //     doctorInfor.paymentId = inputData.selectedPayment;
            //     doctorInfor.nameClinic = inputData.nameClinic;
            //     doctorInfor.addressClinic = inputData.addressClinic;
            //     doctorInfor.note = inputData.note;
            //     doctorInfor.specialtyId = inputData.specialtyId;
            //     doctorInfor.clinicId = inputData.clinicId;
            //     await doctorInfor.save();
            // } else {
            //     //create 
            //     await db.Doctor_Infor.create({
            //         doctorId: inputData.doctorId,
            //         priceId: inputData.selectedPrice,
            //         provinceId: inputData.selectedProvince,
            //         paymentId: inputData.selectedPayment,
            //         nameClinic: inputData.nameClinic,
            //         addressClinic: inputData.addressClinic,
            //         note: inputData.note,
            //         specialtyId: inputData.specialtyId,
            //         clinicId: inputData.clinicId
            //     })
            // }

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

let getAllClinic = async () => {
    try {
        let data = await db.Clinic.findAll();
        if (data.length > 0 && data) {
            data.map(item => {
                item.image = new Buffer.from(item.image, 'base64').toString('binary');
                return item;
            })
        }
        return {
            errCode: 0,
            message: 'OK',
            data: data
        }
    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}

let getDetailClinicById = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                message: 'Missing required parameters!',
            }
        } else {
            let data = await db.Clinic.findOne({
                where: {
                    id: inputId
                },
            })
            if (data) {
                data.image = new Buffer.from(data.image, 'base64').toString('binary');
                let doctorClinic = [];
                doctorClinic = await db.Doctor_Infor.findAll({
                    where: { clinicId: inputId },
                    attributes: ['doctorId', 'provinceId']
                })

                data.doctorClinic = doctorClinic;
            } else data = {};

            return {
                errCode: 0,
                message: 'OK',
                data: data
            }
        }
    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}

let deleteClinicById = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                message: 'Missing required parameters!',
            }
        } else {
            await db.Clinic.destroy({
                where: {
                    id: inputId
                },
            })

            return {
                errCode: 0,
                message: 'Delete clinic successfully!',
            }
        }
    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}

let updateClinicByIdService = async (inputId, data) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                message: 'Missing required parameters!'
            };
        } else {
            let res = await db.Clinic.findOne({
                where: {
                    id: inputId
                },
                raw: false
            });

            if (res && res.image) {
                res.image = data.image;
                res.name = data.name;
                res.address = data.address;
                res.descriptionHTML = data.descriptionHTML;
                res.descriptionMarkdown = data.descriptionMarkdown;

                await res.save();
                return {
                    errCode: 0,
                    message: 'Clinic updated successfully',
                    data: res
                };
            }
        }
    } catch (error) {
        return { errCode: -1, message: 'Error from server...' };
    }
};


module.exports = {
    createClinic,
    getDetailClinicById,
    getAllClinic,
    deleteClinicById,
    updateClinicByIdService
}