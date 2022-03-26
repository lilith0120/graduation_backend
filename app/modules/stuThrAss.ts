import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import Teacher from './teacher';
import Student from './student';

class StuThrAss extends Model {
};

StuThrAss.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    is_group: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }, // 答辩老师标志位
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }, // 学生答辩标志位
}, {
    sequelize,
    tableName: 'stu_thr_ass',
});

StuThrAss.belongsTo(Teacher);
StuThrAss.belongsTo(Student);

export default StuThrAss;