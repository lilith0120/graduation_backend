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
    pass: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }, // 学生答辩通过标志位
}, {
    sequelize,
    tableName: 'stuThrAss',
});

StuThrAss.belongsTo(Teacher);
StuThrAss.belongsTo(Student);

export default StuThrAss;