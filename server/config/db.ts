import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../medico-bot.sqlite'),
    logging: false
});

export default sequelize;
