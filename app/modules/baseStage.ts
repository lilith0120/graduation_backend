import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";

class BaseStage extends Model {
    pre_id: number;
    id: number;
    children: any[];
};

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
    pre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, // 上一阶段id
}, {
    sequelize,
    tableName: 'base_stage',
});

export default BaseStage;