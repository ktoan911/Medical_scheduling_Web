var bcrypt = require('bcryptjs');
const db = require('../../models/index');
var salt = bcrypt.genSaltSync(10);

let createUser = async (data) => {
    try {
        let hasdPasswordBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            email: data.email,
            password: hasdPasswordBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId,
            phoneNumber: data.phoneNumber,
            //positionId: DataTypes.STRING,
            // image: DataTypes.STRING,
        })
        console.log('Created successfully!');
    } catch (error) {
        console.log('Fail to add new!', error);
    }
}
//Bcrypt
let hashUserPassword = async (password) => {
    return await bcrypt.hashSync(password, salt);
}

let getAllUser = async (req, res) => {
    return await db.User.findAll({
        raw: true
    });
}

let deleteUserById = async (id) => {
    return await db.User.destroy({
        where: { id: id }
    });
}

let getUserById = async (userId) => {
    return await db.User.findOne({
        where: { id: userId },
        raw: true,
    });
}

// let updateUserById = async (id) => {
//     return await db.User.update({
//         where: { id: id },
//     })
// }


module.exports = {
    createUser,
    getAllUser,
    getUserById,
    deleteUserById,
    //updateUserById
}