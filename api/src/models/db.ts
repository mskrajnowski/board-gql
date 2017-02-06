import * as Sequelize from 'sequelize';

const DB_URI =
  process.env.DB_URI ||
  'postgres://board_ql:board_ql@localhost:5432/board_ql';

export default new Sequelize(DB_URI, {});
