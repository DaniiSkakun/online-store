const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

// Маппинг кодов/рус/укр названий -> slug
const typeMap = {
  apartment: 'apartment',
  house: 'house',
  land: 'land',
  office: 'office',
  commercial: 'commercial',
  Квартира: 'apartment',
  Дом: 'house',
  Будинок: 'house',
  Коттедж: 'house',
  Участок: 'land',
  Ділянка: 'land',
  Офис: 'office',
  'Коммерческая недвижимость': 'commercial',
  Коммерческая: 'commercial',
  'Комерційна нерухомість': 'commercial',
};

async function main() {
  try {
    // Получаем id по slug
    const [types] = await db.query('select id, slug from property_types');
    const slugToId = {};
    types.forEach((t) => (slugToId[t.slug] = t.id));

    // Обновляем propertyTypeId на основе property_type
    const [props] = await db.query('select id, property_type from properties');
    for (const p of props) {
      const slug = typeMap[p.property_type];
      const id = slugToId[slug];
      if (id) {
        await db.query('update properties set "propertyTypeId" = $1 where id = $2', { bind: [id, p.id] });
      }
    }

    // Проверка результатов
    const [distinctTypes] = await db.query('select distinct property_type, "propertyTypeId" from properties order by property_type');
    console.log('Distinct property_type / propertyTypeId:', distinctTypes);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
