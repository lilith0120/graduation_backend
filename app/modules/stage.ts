import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import Teacher from './teacher';

class Stage extends Model { };

Stage.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    process: {
        type: DataTypes.TEXT,
        allowNull: false,
    }, // 全部阶段
}, {
    sequelize,
    tableName: 'stage',
});

Stage.belongsTo(Teacher);

export default Stage;