import { Model, DataTypes } from 'sequelize';
import sequelize from "../../core/db";
import * as bcrypt from "bcryptjs";
import { OAuthException } from '../../core/http-exception';

class User extends Model {
    user_pswd: string;
    user_id: any;
    user_type: any;
    id: any;

    static async vertifyPassword(userId: string, userPswd: string) {
        const user = await User.findOne({
            where: {
                user_id: userId,
            }
        });
        if (!user) {
            throw new OAuthException(40004);
        }

        const correct = bcrypt.compareSync(userPswd, user.user_pswd);
        if (!correct) {
            throw new OAuthException(40011);
        }

        return user;
    };
};

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
    }, // 用户账号
    user_pswd: {
        type: DataTypes.STRING(255),
        allowNull: false,
        set(val: any) {
            const salt = bcrypt.genSaltSync(10);
            const pswd = bcrypt.hashSync(val, salt);
            this.setDataValue("user_pswd", pswd);
        },
    }, // 用户密码
    email: {
        type: DataTypes.STRING(255),
    }, // 邮箱
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    } // 用户类型 0:学生, 1:老师, 2:管理员
}, {
    sequelize,
    tableName: 'user',
});

export default User;