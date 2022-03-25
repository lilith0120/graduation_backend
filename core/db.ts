import { Sequelize } from 'sequelize';
import config from '../config/config';

const { database: db } = config;

const sequelize = new Sequelize(db.dbName, db.user, db.password, {
    dialect: 'mysql',
    host: db.host,
    port: db.port,
    logging: true,
    timezone: '+08:00',
    define: {
        underscored: true,
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
});
sequelize.sync({
    force: db.env === 'dev',
    // alter: true,
});

export default sequelize;