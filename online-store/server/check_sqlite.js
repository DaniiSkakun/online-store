const { Sequelize } = require('sequelize');

const sqlite = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

async function checkSQLite() {
  try {
    await sqlite.authenticate();
    console.log('✅ SQLite подключен');

    const [props] = await sqlite.query('SELECT COUNT(*) as count FROM properties');
    const [users] = await sqlite.query('SELECT COUNT(*) as count FROM users');
    const [cities] = await sqlite.query('SELECT COUNT(*) as count FROM cities');

    console.log('📊 Данные в SQLite:');
    console.log('🏠 Недвижимость:', props[0].count);
    console.log('👥 Пользователи:', users[0].count);
    console.log('🏙️ Города:', cities[0].count);

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  } finally {
    sqlite.close();
  }
}

checkSQLite();