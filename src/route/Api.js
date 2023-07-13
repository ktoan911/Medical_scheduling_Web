const ApiUserController = require('../controller/Api_userController');
const doctorController = require('../controller/doctorController');
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


    return app.use('/', router);
}

module.exports = initApiRoute;