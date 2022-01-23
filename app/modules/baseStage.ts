import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";

class BaseStage extends Model { };

BaseStage.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 阶段名
}, {
    sequelize,
    tableName: 'base_stage',
});

export default BaseStage;