import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import User from './user';

class Teacher extends Model { };

Teacher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 老师名
    // teacher_id: {
    //     type: DataTypes.STRING(255),
    //     unique: true,
    //     allowNull: false,
    // }, // 教职工号
    sex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, // 性别 0:男, 1:女
    // email: {
    //     type: DataTypes.STRING(255),
    // }, // 邮箱
}, {
    sequelize,
    tableName: 'teacher',
});

Teacher.belongsTo(User);

export default Teacher;