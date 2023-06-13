
const express = require('express');
const homeController = require('../controller/homeController');

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCrud);
    router.post('/post-crud', homeController.postCrud);

    return app.use('/', router);
}

module.exports = initWebRoute;