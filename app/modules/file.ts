import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import Stage from './stage';
import Student from './student';
import Teacher from './teacher';

class File extends Model { };

File.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 材料名
    file_url: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    }, // 材料url
    file_detail: {
        type: DataTypes.TEXT,
    }, // 材料详细
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0：未审核
    }, // 审核状态
    review: {
        type: DataTypes.TEXT,
    }, // 指导老师评论
    review_at: {
        type: DataTypes.DATE,
    }, // 指导老师评论时间
}, {
    sequelize,
    tableName: 'file',
});

File.belongsTo(Student);
File.belongsTo(Teacher);
File.belongsTo(Stage);

export default File;