require('dotenv').config();
console.log('Переменные окружения:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***установлен***' : 'не установлен');

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

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к PostgreSQL успешно!');

    // Получаем список таблиц
    const [results] = await sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log('📋 Таблицы в базе данных:');
    results.forEach(row => {
      console.log('  -', row.tablename);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    process.exit(1);
  }
}

testConnection();

