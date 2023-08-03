const ApiUserController = require('../controller/Api_userController');
const doctorController = require('../controller/doctorController');
const PatientController = require('../controller/PatientController');
const SpecialtyController = require('../controller/SpecialtyController');
const express = require('express');

let router = express.Router();

const initApiRoute = (app) => {
    router.post('/api/login', ApiUserController.handleLogin);
    router.get('/api/get-all-users', ApiUserController.handleGetAllUser);
    router.post('/api/create-user', ApiUserController.handleCreateUser);
    router.put('/api/edit-user', ApiUserController.handleEditUser);
    router.delete('/api/delete-user', ApiUserController.handleDeleteUser);
    router.get('/api/allcode', ApiUserController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', PatientController.postBookAppointment);
    router.post('/api/verify-book-appointment', PatientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', SpecialtyController.createSpecialty);
    router.get('/api/get-all-specialty', SpecialtyController.getAllSpecialty);

    return app.use('/', router);
}

module.exports = initApiRoute;