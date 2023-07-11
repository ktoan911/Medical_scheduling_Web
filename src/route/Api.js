const ApiUserController = require('../controller/Api_userController');
const express = require('express');

let router = express.Router();

const initApiRoute = (app) => {
    router.post('/api/login', ApiUserController.handleLogin);
    router.get('/api/get-all-users', ApiUserController.handleGetAllUser);
    router.post('/api/create-user', ApiUserController.handleCreateUser);
    router.put('/api/edit-user', ApiUserController.handleEditUser);
    router.delete('/api/delete-user', ApiUserController.handleDeleteUser);

    router.get('/api/allcode', ApiUserController.getAllCode);


    return app.use('/', router);
}

module.exports = initApiRoute;