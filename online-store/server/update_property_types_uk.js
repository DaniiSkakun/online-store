const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

async function main() {
  const updates = [
    "update property_types set name='Квартира' where name in ('Квартира','Квартира ')",
    "update property_types set name='Будинок' where name='Дом'",
    "update property_types set name='Ділянка' where name='Участок'",
    "update property_types set name='Офіс' where name='Офис'",
    "update property_types set name='Комерційна нерухомість' where name like 'Коммерчес%'"
  ];

  try {
    for (const q of updates) {
      await db.query(q);
    }
    const [types] = await db.query('select id,name from property_types order by id');
    console.log(types);
  } catch (e) {
    console.error('Update error:', e.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
