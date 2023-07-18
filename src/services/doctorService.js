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
let saveInfoDoctor = async (inputData) => {
    try {
        if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkDown || !inputData.action) {
            return {
                errCode: 1,
                message: 'Missing parameter!',
            };
        } else {
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
            return {
                errCode: 0,
                message: 'Save info doctor successfully!',
            };
        }
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
    console.log('check data', data);
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
            //convert date
            if (exiting && exiting.length > 0) {
                exiting = exiting.map(item => {
                    item.date = new Date(item.date).getTime();
                    return item;
                })
            }
            //compare different with lodash
            let toCreate = _.differenceWith(schedule, exiting, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
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


module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule
}