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

async function simpleMigrate() {
  try {
    console.log('🚀 Простая миграция данных...\n');

    await sqlite.authenticate();
    await postgres.authenticate();

    console.log('✅ Оба подключения работают\n');

    // Миграция городов
    console.log('📍 Миграция городов...');
    const [citiesData] = await sqlite.query('SELECT * FROM cities');
    console.log(`Найдено городов: ${citiesData.length}`);

    for (const city of citiesData) {
      try {
        await postgres.query(
          `INSERT INTO cities (id, name, "createdAt", "updatedAt") VALUES (${city.id}, '${city.name}', '${city.createdAt}', '${city.updatedAt}')`
        );
      } catch (e) {
        console.log(`Ошибка города ${city.id}:`, e.message);
      }
    }

    // Миграция пользователей
    console.log('\n👥 Миграция пользователей...');
    const [usersData] = await sqlite.query('SELECT * FROM users');
    console.log(`Найдено пользователей: ${usersData.length}`);

    for (const user of usersData) {
      try {
        await postgres.query(
          `INSERT INTO users (id, email, password, role, "createdAt", "updatedAt") VALUES (${user.id}, '${user.email}', '${user.password}', '${user.role}', '${user.createdAt}', '${user.updatedAt || user.createdAt}')`
        );
      } catch (e) {
        console.log(`Ошибка пользователя ${user.id}:`, e.message);
      }
    }

    // Миграция типов недвижимости
    console.log('\n🏠 Миграция типов недвижимости...');
    const [typesData] = await sqlite.query('SELECT * FROM property_types');
    console.log(`Найдено типов: ${typesData.length}`);

    for (const type of typesData) {
      try {
        await postgres.query(
          `INSERT INTO property_types (id, name, slug, "createdAt", "updatedAt") VALUES (${type.id}, '${type.name}', '${type.slug}', '${type.createdAt}', '${type.updatedAt}')`
        );
      } catch (e) {
        console.log(`Ошибка типа ${type.id}:`, e.message);
      }
    }

    // Миграция районов
    console.log('\n🏙️ Миграция районов...');
    const [districtsData] = await sqlite.query('SELECT * FROM districts');
    console.log(`Найдено районов: ${districtsData.length}`);

    for (const district of districtsData) {
      try {
        await postgres.query(
          `INSERT INTO districts (id, name, "cityId", "createdAt", "updatedAt") VALUES (${district.id}, '${district.name}', ${district.cityId}, '${district.createdAt}', '${district.updatedAt}')`
        );
      } catch (e) {
        console.log(`Ошибка района ${district.id}:`, e.message);
      }
    }

    // Миграция недвижимости (только базовые поля, без внешних ключей)
    console.log('\n🏠 Миграция недвижимости...');
    const [propertiesData] = await sqlite.query('SELECT id, title, price, address, city, cityId, area, rooms, floor, total_floors, property_type, description, latitude, longitude, images, is_active, userId, createdAt, updatedAt FROM properties');
    console.log(`Найдено недвижимости: ${propertiesData.length}`);

    for (const property of propertiesData) {
      try {
        await postgres.query(
          `INSERT INTO properties (id, title, price, address, city, "cityId", area, rooms, floor, total_floors, property_type, description, latitude, longitude, images, is_active, "userId", "createdAt", "updatedAt") VALUES (${property.id}, '${property.title.replace(/'/g, "''")}', ${property.price}, '${property.address.replace(/'/g, "''")}', '${property.city}', ${property.cityId}, ${property.area}, ${property.rooms}, ${property.floor}, ${property.total_floors}, '${property.property_type}', '${(property.description || '').replace(/'/g, "''")}', ${property.latitude}, ${property.longitude}, '${JSON.stringify(property.images).replace(/'/g, "''")}', ${property.is_active ? 1 : 0}, ${property.userId}, '${property.createdAt}', '${property.updatedAt}')`
        );
      } catch (e) {
        console.log(`Ошибка недвижимости ${property.id}:`, e.message);
      }
    }

    console.log('\n✅ Миграция завершена!');

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await sqlite.close();
    await postgres.close();
  }
}

simpleMigrate();