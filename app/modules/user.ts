import { Model, DataTypes } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import sequelize from "../../core/db";

class User extends Model { };

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, // 自增长id
    user_id: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    }, // 用户openId号
    user_avatar: {
        type: DataTypes.STRING(255),
    }, // 用户qq号头像
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    } // 用户类型 0:学生, 1:老师, 2:管理员
}, {
    sequelize,
    tableName: 'user',
});

export default User;