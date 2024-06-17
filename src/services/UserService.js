const db = require('../../models');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = async (password) => {
    return await bcrypt.hash(password, salt);
};

let handleUserLogin = async (email, password) => {
    let userData = {};

    try {
        let isExist = await checkUserEmail(email);
        if (isExist.errCode === 0) {
            let user = await db.BenhNhan.findOne({
                attributes: ['IDBenhNhan', 'email', 'password', 'hoten', 'username'],
                where: { email },
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
                userData.errMsg = 'User not found';
            }
        } else {
            userData.errCode = 2;
            userData.errMsg = 'User not found';
        }
    } catch (error) {
        console.error(error);
        userData.errCode = 3;
        userData.errMsg = 'Error occurred';
    }

    return userData;
};

let checkUserEmail = async (email) => {
    let userData = {};
    try {
        let user = await db.BenhNhan.findOne({ where: { email } });
        if (user) {
            userData.errCode = 0;
            userData.errMsg = 'ok';
            userData.user = user;
            return userData;
        } else {
            userData.errCode = 1;
            userData.errMsg = 'Email not found';
            return userData;
        }
    } catch (error) {
        console.error(error);
        return {
            errCode: -1,
            errMsg: 'An error occurred'
        };
    }
};

const getAllUsers = async (userId) => {
    try {
        let users = null;
        if (userId === 'All') {
            users = await db.BenhNhan.findAll({
                attributes: {
                    exclude: ['password']
                }
            });
        } else if (userId) {
            users = await db.BenhNhan.findOne({
                where: { IDBenhNhan: userId },
                attributes: {
                    exclude: ['password']
                }
            });
        }
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

let createUser = async (data) => {
    try {
        let check = await checkUserEmail(data.email);
        if (check.errCode === 0) {
            return { errCode: 1, errMsg: 'Email already exists' };
        } else {
            let hashPasswordBcrypt = await hashUserPassword(data.password);
            await db.BenhNhan.create({
                email: data.email,
                password: hashPasswordBcrypt,
                hoten: data.hoten,
                username: data.username,
                namSinh: data.namSinh,
                diaChi: data.diaChi,
                SDT: data.SDT,
                gioiTinh: data.gioiTinh,
                SoLanHuy: data.SoLanHuy
            });
            return { errCode: 0, message: 'ok' };
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

let deleteUserById = async (userId) => {
    try {
        let user = await db.BenhNhan.findOne({
            where: { IDBenhNhan: userId },
            raw: false
        });
        if (user) {
            await db.BenhNhan.destroy({
                where: { IDBenhNhan: userId },
            });
            return { errCode: 0, message: 'User deleted successfully' };
        } else {
            return { errCode: 1, message: 'User not found' };
        }
    } catch (error) {
        console.error(error);
        return { errCode: -1, message: 'An error occurred' };
    }
};

let updateUserById = async (data) => {
    try {
        if (!data.IDBenhNhan) {
            return { errCode: 2, message: 'Id is required' };
        }
        let user = await db.BenhNhan.findOne({
            where: { IDBenhNhan: data.IDBenhNhan },
            raw: false
        });

        if (user) {
            user.hoten = data.hoten;
            user.username = data.username;
            user.namSinh = data.namSinh;
            user.diaChi = data.diaChi;
            user.SDT = data.SDT;
            user.gioiTinh = data.gioiTinh;
            user.SoLanHuy = data.SoLanHuy;

            await user.save();
            return { errCode: 0, message: 'User updated successfully' };
        } else {
            return { errCode: 1, message: 'User not found' };
        }
    } catch (error) {
        console.error(error);
        return { errCode: -1, message: 'An error occurred' };
    }
};

// let getAllCodeService = async (typeInput) => {
//     try {
//         let res = {};
//         if (!typeInput) {
//             res.errCode = 1;
//             res.errMsg = 'Missing required field ' + typeInput;
//             return res;
//         } else {
//             let allcode = await db.Allcode.findAll({
//                 where: { type: typeInput }
//             });
//             res.errCode = 0;
//             res.data = allcode;
//         }
//         return res;
//     } catch (error) {
//         console.error(error);
//         return { errCode: -1, errMsg: 'An error occurred' };
//     }
// };

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createUser,
    deleteUserById,
    updateUserById,
    // getAllCodeService
};
