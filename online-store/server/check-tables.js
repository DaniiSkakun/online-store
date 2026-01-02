require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
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

async function checkTables() {
  try {
    console.log('🔍 Проверяем данные в таблицах...\n');

    // Проверяем пользователей
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Пользователи:', users[0].count);

    if (users[0].count > 0) {
      const [userData] = await sequelize.query('SELECT email, role FROM users LIMIT 3');
      console.log('📧 Примеры пользователей:');
      userData.forEach(user => console.log('  -', user.email, '(роль:', user.role + ')'));
    }

    // Проверяем города
    const [cities] = await sequelize.query('SELECT COUNT(*) as count FROM cities');
    console.log('\n🏙️ Города:', cities[0].count);

    if (cities[0].count > 0) {
      const [cityData] = await sequelize.query('SELECT name FROM cities LIMIT 5');
      console.log('🌆 Примеры городов:');
      cityData.forEach(city => console.log('  -', city.name));
    }

    // Проверяем районы
    const [districts] = await sequelize.query('SELECT COUNT(*) as count FROM districts');
    console.log('\n🏘️ Районы:', districts[0].count);

    // Проверяем недвижимость
    const [properties] = await sequelize.query('SELECT COUNT(*) as count FROM properties');
    console.log('\n🏠 Недвижимость:', properties[0].count);

    if (properties[0].count > 0) {
      const [propData] = await sequelize.query('SELECT title, price FROM properties LIMIT 3');
      console.log('🏠 Примеры недвижимости:');
      propData.forEach(prop => console.log('  -', prop.title, '(', prop.price, '₴)'));
    }

    console.log('\n✅ Все данные на месте!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

checkTables();

