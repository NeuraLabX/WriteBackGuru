import { Sequelize, QueryTypes } from 'sequelize';

const databases: { [key: string]: any } = {
  PostgreSQL: {
    dialect: 'postgres',
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
  },
  Oracle: {
    dialect: 'oracle',
    host: process.env.ORACLE_HOST,
    database: process.env.ORACLE_DATABASE,
    username: process.env.ORACLE_USERNAME,
    password: process.env.ORACLE_PASSWORD,
  },
  MSSQL: {
    dialect: 'mssql',
    host: process.env.MSSQL_HOST,
    database: process.env.MSSQL_DATABASE,
    username: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
  },
};

const connect = async (dbType: string, credentials: any) => {
  const dbConfig = databases[dbType];
  if (!dbConfig) throw new Error(`Unsupported database type: ${dbType}`);

  const sequelize = new Sequelize(dbConfig);
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  return sequelize;
};

const disconnect = async (sequelize: Sequelize) => {
  try {
    await sequelize.close();
    console.log('Connection has been closed successfully.');
  } catch (error) {
    console.error('Unable to close the database connection:', error);
  }
};

const save = async (sequelize: Sequelize, data: any, tableName: string) => {
  try {
    await sequelize.query(`INSERT INTO ${tableName} SET ?`, {
      replacements: [data],
      type: QueryTypes.INSERT // Fix: Import and use QueryTypes from Sequelize
    });
    console.log('Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export default { connect, disconnect, save };
