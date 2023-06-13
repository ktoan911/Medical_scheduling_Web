
const db = require('../../models/index');
require('dotenv').config();
const CrudService = require('../services/CrudService');

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e)
    }
}

let getCrud = (req, res) => {
    return res.render('crud.ejs');
}

let postCrud = async (req, res) => {
    await CrudService.createUser(req.body);
    return res.send('crud.ejs');
}

module.exports = {
    getHomePage,
    getCrud,
    postCrud,
}