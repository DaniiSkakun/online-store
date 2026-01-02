const { Sequelize } = require('sequelize');
require('dotenv').config();

// Подключения
const sqlite = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const postgres = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false
  }
);

async function migrateProperties() {
  try {
    console.log('🏠 Миграция недвижимости...\n');

    await sqlite.authenticate();
    await postgres.authenticate();

    const [propertiesData] = await sqlite.query('SELECT id, title, price, address, city, cityId, area, rooms, floor, total_floors, property_type, description, latitude, longitude, images, is_active, userId, createdAt, updatedAt FROM properties');
    console.log(`Найдено недвижимости: ${propertiesData.length}`);

    let successCount = 0;
    for (const property of propertiesData) {
      try {
        const isActiveBool = property.is_active ? 'true' : 'false';
        const imagesJson = JSON.stringify(property.images).replace(/'/g, "''");
        const title = property.title.replace(/'/g, "''");
        const address = property.address.replace(/'/g, "''");
        const description = (property.description || '').replace(/'/g, "''");

        await postgres.query(`
          INSERT INTO properties (
            id, title, price, address, city, "cityId", area, rooms, floor, total_floors,
            property_type, description, latitude, longitude, images, is_active, "userId", "createdAt", "updatedAt"
          ) VALUES (
            ${property.id},
            '${title}',
            ${property.price},
            '${address}',
            '${property.city}',
            ${property.cityId},
            ${property.area},
            ${property.rooms},
            ${property.floor},
            ${property.total_floors},
            '${property.property_type}',
            '${description}',
            ${property.latitude},
            ${property.longitude},
            '${imagesJson}',
            ${isActiveBool},
            ${property.userId},
            '${property.createdAt}',
            '${property.updatedAt}'
          )
        `);
        successCount++;
      } catch (e) {
        console.log(`❌ Ошибка недвижимости ${property.id}:`, e.message);
      }
    }

    console.log(`\n✅ Успешно перенесено: ${successCount} из ${propertiesData.length} объектов недвижимости`);

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await sqlite.close();
    await postgres.close();
  }
}

migrateProperties();