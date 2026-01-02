const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

async function main() {
  const reps = [
    ['ввул. ', 'вул. '],
    ['ввул.', 'вул.'],
    ['вввул. ', 'вул. '],
    ['вввул.', 'вул.'],
  ];
  try {
    for (const [f, t] of reps) {
      await db.query(
        `update properties set address=replace(address,'${f}','${t}') where address like '%${f}%'`
      );
    }
    const [props] = await db.query('select city,address from properties limit 5');
    console.log(props);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
