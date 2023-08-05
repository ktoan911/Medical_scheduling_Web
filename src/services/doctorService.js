const db = require('../../models/index');
require('dotenv').config();
const _ = require('lodash');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = async (limit) => {
    try {
        let users = await db.User.findAll({
            limit: limit,
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            where: {
                roleId: 'role_doctor',
            },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true,
        })
        return users;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

let getAllDoctors = async () => {
    try {
        let doctors = await db.User.findAll({
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password', 'image']
            },
            where: {
                roleId: 'role_doctor',
            },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true,
        })
        return doctors;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

let getAllDoctorInfor = async () => {
    try {
        let doctors = await db.Doctor_Infor.findAll();
        return doctors;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

const requiredFields = [
    'doctorId',
    'contentHTML',
    'contentMarkDown',
    'action',
    'selectedPrice',
    'selectedPayment',
    'selectedProvince',
    'nameClinic',
    'addressClinic',
    'note',
    'clinicId',
    'specialtyId',
];

let saveInfoDoctor = async (inputData) => {
    if (!inputData) {
        return {
            errCode: 1,
            message: 'Missing parameter!',
        };
    }

    for (const field of requiredFields) {
        if (!inputData[field]) {
            return {
                errCode: 1,
                message: 'Missing parameter: ' + field,
            };
        }
    }

    try {
        //upsert to markdown
        if (inputData.action === 'CREATE') {
            await db.MarkDown.create({
                contentHTML: inputData.contentHTML,
                contentMarkDown: inputData.contentMarkDown,
                description: inputData.description,
                doctorId: inputData.doctorId
            });
        } else if (inputData.action === 'EDIT') {
            let doctorMarkDown = await db.MarkDown.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            })
            if (doctorMarkDown) {
                doctorMarkDown.contentHTML = inputData.contentHTML
                doctorMarkDown.contentMarkDown = inputData.contentMarkDown
                doctorMarkDown.description = inputData.description
                await doctorMarkDown.save()
            }
        }

        //upsert to doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
        })
        if (doctorInfor) {
            //update
            doctorInfor.doctorId = inputData.doctorId;
            doctorInfor.priceId = inputData.selectedPrice;
            doctorInfor.provinceId = inputData.selectedProvince;
            doctorInfor.paymentId = inputData.selectedPayment;
            doctorInfor.nameClinic = inputData.nameClinic;
            doctorInfor.addressClinic = inputData.addressClinic;
            doctorInfor.note = inputData.note;
            doctorInfor.specialtyId = inputData.specialtyId;
            doctorInfor.clinicId = inputData.clinicId;
            await doctorInfor.save();
        } else {
            //create 
            await db.Doctor_Infor.create({
                doctorId: inputData.doctorId,
                priceId: inputData.selectedPrice,
                provinceId: inputData.selectedProvince,
                paymentId: inputData.selectedPayment,
                nameClinic: inputData.nameClinic,
                addressClinic: inputData.addressClinic,
                note: inputData.note,
                specialtyId: inputData.specialtyId,
                clinicId: inputData.clinicId
            })
        }
        return {
            errCode: 0,
            message: 'Save info doctor successfully!',
        };

    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
};

let getDetailDoctorById = async (id) => {
    try {
        if (!id) {
            return {
                errCode: 1,
                message: 'Missing parameter!',
            };
        } else {
            let data = await db.User.findOne({
                where: {
                    id: id,
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.MarkDown,
                        attributes: ['description', 'contentHTML', 'contentMarkDown']
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },

                            { model: db.Specialty, as: 'specialtyTypeData', attributes: ['id', 'name'] },
                        ]
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true,
            })
            //convert image to base64
            if (data && data.image) {
                data.image = new Buffer.from(data.image, 'base64').toString('binary');
            }
            if (!data) data = {};

            return {
                errCode: 0,
                message: 'OK',
                data: data
            };
        }
    } catch (error) {
        return {
            errCode: -1,
            message: 'Error from server...',
        };
    }
}

let bulkCreateSchedule = async (data) => {
    try {
        if (!data.arrSchedule && !data.doctorId || !data.formatedDate) {
            return {
                errCode: 1,
                message: 'Missing data!',
            };
        } else {
            let schedule = data.arrSchedule;
            if (schedule && schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                })
            }
            //get all existed schedules
            let exiting = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.formatedDate },
                attributes: ['timeType', 'date', 'maxNumber', 'doctorId'],
                raw: true
            })
            //compare different with lodash
            let toCreate = _.differenceWith(schedule, exiting, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date;
            })
            //create data
            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate);
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

let getScheduleByDateService = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.Allcode, as: 'timeTypeData',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.User, as: 'doctorData',
                        attributes: ['firstName', 'lastName']
                    },
                ],
                raw: false,
                nest: true,
            })
            if (!data) data = [];

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

let getExtraInforDoctorById = async (doctorId) => {
    try {
        if (!doctorId) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            let data = await db.Doctor_Infor.findOne({
                where: {
                    doctorId: doctorId,
                },
                attributes: {
                    exclude: ['id', 'doctorId'],
                },
                include: [
                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                ],
                raw: false,
                nest: true,
            })
            if (!data) data = [];

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

let getProfileDoctorById = async (doctorId) => {
    try {
        if (!doctorId) {
            return {
                errCode: 1,
                message: 'Missing requied parameters!',
            }
        } else {
            let data = await db.User.findOne({
                where: {
                    id: doctorId,
                },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.MarkDown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown'],
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                        ],
                    }
                ],
                raw: false,
                nest: true,
            })
            if (!data) data = [];
            if (data && data.image) {
                data.image = new Buffer.from(data.image, 'base64').toString('binary');
            }

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
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDateService,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getAllDoctorInfor
}