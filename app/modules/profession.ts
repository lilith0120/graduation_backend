import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";

class Profession extends Model { };

Profession.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }, // 专业名
}, {
    sequelize,
    tableName: 'profession',
});

export default Profession;