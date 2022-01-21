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
});
sequelize.sync({
    force: db.env === 'dev',
});

export default sequelize;