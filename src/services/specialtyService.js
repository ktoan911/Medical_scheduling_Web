const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');

let createSpecialty = async (data) => {
    try {
        if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return {
                errCode: 1,
                message: 'Missing required parameters!',
            }
        } else {
            await db.Specialty.create({
                name: data.name,
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

let getAllSpecialty = async () => {
    try {
        let res = await db.Specialty.findAll();
        if (res && res.length > 0) {
            res.map(item => {
                item.image = new Buffer.from(item.image, 'base64').toString('binary');
                return item;
            })
        }
        return {
            errCode: 0,
            message: 'OK',
            data: res
        }

    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}

let getDetailSpecialtyById = async (id, location) => {
    try {
        if (!id || !location) {
            return {
                errCode: 1,
                message: 'missing parameter!',
            }
        } else {
            let data = await db.Specialty.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown']
            })
            if (data) {
                let doctorSpecialty = [];
                if (location === 'ALL') {
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: {
                            specialtyId: id,
                        },
                        attributes: ['doctorId', 'provinceId']
                    })
                } else {
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: {
                            specialtyId: id,
                            provinceId: location
                        },
                        attributes: ['doctorId', 'provinceId']
                    })
                }
                data.doctorSpecialty = doctorSpecialty;
            } else {
                data = {}
            }
            return {
                errCode: 0,
                message: 'OK',
                data
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
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}