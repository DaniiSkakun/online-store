const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkData() {
  console.log('Проверяю подключение к real_estate_db...');

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

  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к real_estate_db успешно!');

    console.log('\n📊 Проверяю данные в таблицах...');

    const [props] = await sequelize.query("SELECT COUNT(*) as count FROM properties");
    const [users] = await sequelize.query("SELECT COUNT(*) as count FROM users");
    const [cities] = await sequelize.query("SELECT COUNT(*) as count FROM cities");
    const [districts] = await sequelize.query("SELECT COUNT(*) as count FROM districts");

    console.log('📈 Количество записей:');
    console.log(`  - properties: ${props[0].count}`);
    console.log(`  - users: ${users[0].count}`);
    console.log(`  - cities: ${cities[0].count}`);
    console.log(`  - districts: ${districts[0].count}`);

    // Посмотрим на структуру таблиц
    console.log('\n📋 Структура таблиц:');
    const tables = ['cities', 'users', 'properties', 'districts'];
    for (const table of tables) {
      try {
        const [columns] = await sequelize.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = 'public' ORDER BY ordinal_position`);
        console.log(`\n${table.toUpperCase()} columns:`);
        columns.slice(0, 5).forEach(col => console.log(`  - ${col.column_name} (${col.data_type})`));
      } catch (e) {
        console.log(`Ошибка получения структуры ${table}:`, e.message);
      }
    }

    await sequelize.close();
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
    sequelize.close();
  }
}

checkData();