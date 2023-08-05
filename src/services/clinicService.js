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
                attributes: {
                    exclude: ['image']
                },
            })
            if (data) {
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

module.exports = {
    createClinic,
    getDetailClinicById,
    getAllClinic
}