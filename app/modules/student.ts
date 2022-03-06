import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import User from './user';
import Teacher from './teacher';
import Profession from './profession';

class Student extends Model {
    grade: any;
};

Student.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 学生名
    // student_id: {
    //     type: DataTypes.STRING(255),
    //     unique: true,
    //     allowNull: false,
    // }, // 学号
    sex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, // 性别 0:男, 1:女
    grade: {
        type: DataTypes.STRING(20),
        allowNull: false,
    }, // 年级
    // email: {
    //     type: DataTypes.STRING(255),
    // }, // 邮箱
    base_stage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0：未开始
    }, // 毕设基础阶段id
    stage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0：未开始
    }, // 毕设阶段id
}, {
    sequelize,
    tableName: 'student',
});

Student.belongsTo(User);
Student.belongsTo(Teacher);
Student.belongsTo(Profession);

export default Student;