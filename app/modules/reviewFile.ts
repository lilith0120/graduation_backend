import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import Teacher from './teacher';
import Student from './student';

class ReviewFile extends Model {
};

ReviewFile.init({
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
}, {
    sequelize,
    tableName: 'review_file',
});

ReviewFile.belongsTo(Teacher);
ReviewFile.belongsTo(Student);

export default ReviewFile;