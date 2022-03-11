import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import Teacher from './teacher';

class Stage extends Model {
    pre_id: number;
    id: number;
};

Stage.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 阶段名
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, // 根阶段id
    pre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, // 上一阶段id
    begin_at: {
        type: DataTypes.DATE,
    }, // 开始时间
    end_at: {
        type: DataTypes.DATE,
    }, // 结束时间
}, {
    sequelize,
    tableName: 'stage',
});

Stage.belongsTo(Teacher);

export default Stage;