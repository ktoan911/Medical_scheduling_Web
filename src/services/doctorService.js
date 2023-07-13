const db = require('../../models/index');

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
        if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkDown) {
            return {
                errCode: 1,
                message: 'Missing parameter!',
            };
        } else {
            await db.MarkDown.create({
                contentHTML: inputData.contentHTML,
                contentMarkDown: inputData.contentMarkDown,
                description: inputData.description,
                doctorId: inputData.doctorId
            });
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


module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveInfoDoctor
}