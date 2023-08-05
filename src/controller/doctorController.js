const doctorService = require('../services/doctorService');

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit); // Use a different variable name to avoid conflict with the response object
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data: response // Use "data" field to send the response from the doctorService
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ // Use 500 status code for server error
            errCode: -1,
            message: 'Error from server...',
            error: error // Send the error object in the response
        });
    }
};

let getAllDoctors = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctors();
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ // Use 500 status code for server error
            errCode: -1,
            message: 'Error from server...',
            error: error // Send the error object in the response
        });
    }
}

let getAllDoctorInfor = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctorInfor();
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ // Use 500 status code for server error
            errCode: -1,
            message: 'Error from server...',
            error: error // Send the error object in the response
        });
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
            error: error
        });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
            error: error
        });
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
            error: error
        });
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
            error: error
        });
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...',
        });
    }
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getAllDoctorInfor
};
