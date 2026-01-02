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
    ['apartment', 'Квартира'],
    ['house', 'Будинок'],
    ['land', 'Ділянка'],
    ['office', 'Офіс'],
    ['commercial', 'Комерційна нерухомість'],
    ['Коммерческая', 'Комерційна нерухомість'],
    ['Коммерческая недвижимость', 'Комерційна нерухомість'],
    ['Дом', 'Будинок'],
    ['Участок', 'Ділянка'],
    ['Офис', 'Офіс'],
  ];

  try {
    for (const [from, to] of updates) {
      await db.query(`update properties set property_type='${to}' where property_type='${from}'`);
    }
    const [distinctTypes] = await db.query('select distinct property_type from properties');
    console.log('Distinct property_type:', distinctTypes);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
