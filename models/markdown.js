'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MarkDown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            MarkDown.belongsTo(models.User, { foreignKey: 'doctorId' })
        }
    }
    MarkDown.init({
        contentHTML: DataTypes.TEXT('long'),
        contentMarkDown: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        description: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'MarkDown',
    });
    return MarkDown;
};