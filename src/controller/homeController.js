const connection = require('../config/connectDBWithQuery');
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

let notFound404 = (req, res) => {
    return res.render('404.ejs');
}

let getCrud = (req, res) => {
    return res.render('crud.ejs');
}

let postCrud = async (req, res) => {
    await CrudService.createUser(req.body);
    return res.redirect('/user');
}

let getAllUsers = async (req, res) => {
    let data = await CrudService.getAllUser();
    return res.render('user/getUser.ejs', { data })
}

let getEditUser = async (req, res) => {
    let userId = await req.query.id;
    if (userId) {
        let data = await CrudService.getUserById(userId);
        return res.render('user/editUser.ejs', { data });
    } else {
        return res.send('user not found');
    }
}

let updateUser = async (req, res) => {
    let id = req.body.id;
    if (id) {
        connection.query('UPDATE users SET? WHERE id =?', [req.body, id])
    } else {
        return res.redirect('/404');
    }
    return res.redirect('/user');
}

let deleteUser = async (req, res) => {
    let id = await req.query.id;
    if (id) {
        await CrudService.deleteUserById(id);
    }
    return res.redirect('/user');
}

module.exports = {
    getHomePage,
    getCrud,
    postCrud,
    getAllUsers,
    getEditUser,
    updateUser,
    notFound404,
    deleteUser
}