const { Sequelize } = require('sequelize');

const sqlite = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

async function checkColumns() {
  try {
    await sqlite.authenticate();
    console.log('✅ SQLite подключен\n');

    // Получаем структуру таблицы properties
    const [columns] = await sqlite.query("PRAGMA table_info(properties)");
    console.log('📋 Столбцы в SQLite таблице properties:');
    columns.forEach(col => console.log(`  - ${col.name} (${col.type})`));

    console.log('\n📊 Пример данных:');
    const [sample] = await sqlite.query("SELECT * FROM properties LIMIT 1");
    if (sample.length > 0) {
      console.log('Ключи объекта:', Object.keys(sample[0]));
    }

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  } finally {
    sqlite.close();
  }
}

checkColumns();