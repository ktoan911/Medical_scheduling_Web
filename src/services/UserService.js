const db = require('../../models/index');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const connection = require('../config/connectDBWithQuery');

let hashUserPassword = async (password) => {
    return await bcrypt.hashSync(password, salt);
}

let handleUserLogin = async (email, password) => {
    let userData = {};

    try {
        let isExist = await checkUserEmail(email);
        if (isExist) {
            let user = await db.User.findOne({
                attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                where: {
                    email: email,
                },
                raw: true
            });
            if (user) {
                let check = bcrypt.compareSync(password, user.password);
                if (check) {
                    userData.errCode = 0;
                    userData.errMsg = 'ok';

                    delete user.password;
                    userData.user = user;
                } else {
                    userData.errCode = 1;
                    userData.errMsg = 'Wrong password';
                }
            } else {
                userData.errCode = 1;
                userData.errMsg = 'User is not found';
            }
        } else {
            userData.errCode = 2;
            userData.errMsg = 'User is not found';
        }
    } catch (error) {
        userData.errCode = 3;
        userData.errMsg = 'Error occurred';
    }

    return userData;
}


let checkUserEmail = async (email) => {
    try {
        userData = {};
        let user = await db.User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            userData.errCode = 0;
            userData.errMsg = 'ok';
            userData.user = user;
            return userData;
        } else {
            userData.errCode = 1;
            userData.errMsg = 'Your email is required or exists.';
            return userData;
        }
    } catch (error) {
        console.error(error)
    }
}

const getAllUsers = async (userId) => {
    try {
        let users = null;
        if (userId === 'All') {
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                }
            });
        } else if (userId) {
            users = await db.User.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                },
            });
        }
        return users;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};

let createUser = async (data) => {
    try {
        // Check if email exists
        let check = await checkUserEmail(data.email);
        if (check.errCode === 0) {
            return {
                errCode: 1,
                errMsg: 'Email already exists'
            };
        } else {
            let hashPasswordBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
                phoneNumber: data.phoneNumber,
                image: data.avatar
            });
            return {
                errCode: 0,
                message: 'ok'
            }
        }

    } catch (error) {
        // Handle the error appropriately (e.g., log, return an error message)
        console.error(error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

let deleteUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false
        });
        if (user) {
            await db.User.destroy({
                where: { id: userId },
            });
            return {
                errCode: 0,
                message: 'User deleted successfully'
            };
        } else {
            return {
                errCode: 1,
                message: 'User not found'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            errCode: -1,
            message: 'An error occurred'
        };
    }
}

let updateUserById = async (data) => {
    try {
        if (!data.id) {
            return {
                errCode: 2,
                message: 'Id is required'
            };
        }
        let user = await db.User.findOne({
            where: { id: data.id },
            raw: false
        });

        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            user.gender = data.gender;
            user.roleId = data.roleId;
            user.phoneNumber = data.phoneNumber;
            user.positionId = data.positionId;
            user.image = data.avatar;

            await user.save();
            return {
                errCode: 0,
                message: 'User updated successfully'
            };
        } else {
            return {
                errCode: 1,
                message: 'User is not found'
            };
        }
    } catch (error) {
        console.error(error);
        return {
            errCode: -1,
            message: 'An error occurred'
        };
    }
};

let getAllCodeService = async (typeInput) => {
    try {
        let res = {};
        if (!typeInput) {
            res.errCode = 1;
            res.errMsg = 'Missing required field ' + typeInput;
            return res;
        } else {
            let allcode = await db.Allcode.findAll({
                where: {
                    type: typeInput
                }
            });
            res.errCode = 0;
            res.data = allcode
        }
        return res;
    } catch (error) {

    }
}


module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createUser,
    deleteUserById,
    updateUserById,
    getAllCodeService
}