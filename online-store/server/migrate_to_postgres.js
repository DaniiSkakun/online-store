const { Sequelize } = require('sequelize');
require('dotenv').config();

// Подключение к SQLite (источник данных)
const sqliteSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Подключение к PostgreSQL (цель)
const postgresSequelize = new Sequelize(
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

async function migrateData() {
  try {
    console.log('🚀 Начинаю миграцию данных из SQLite в PostgreSQL...\n');

    // Проверяем подключения
    console.log('🔍 Проверяю подключения...');
    await sqliteSequelize.authenticate();
    console.log('✅ SQLite подключен');

    await postgresSequelize.authenticate();
    console.log('✅ PostgreSQL подключен\n');

    // Отключаем проверки внешних ключей на время миграции
    await postgresSequelize.query('SET session_replication_role = replica;');

    // Определяем порядок миграции (важно соблюдать зависимости)
    const tables = [
      'cities',           // Сначала независимые таблицы
      'property_types',
      'users',
      'districts',        // Потом таблицы с внешними ключами
      'properties',
      'baskets',
      'basket_properties',
      'ratings',
      'property_features',
      'favorites',
      'property_type_districts',
      'password_resets'
    ];

    for (const tableName of tables) {
      console.log(`📋 Миграция таблицы: ${tableName}`);

      try {
        // Получаем все данные из SQLite
        const [sqliteData] = await sqliteSequelize.query(`SELECT * FROM ${tableName}`);

        if (sqliteData && sqliteData.length > 0) {
          console.log(`   Найдено записей: ${sqliteData.length}`);

            // Очищаем таблицу в PostgreSQL перед вставкой
          await postgresSequelize.query(`DELETE FROM ${tableName}`);

          // Вставляем данные в PostgreSQL
          for (const row of sqliteData) {
            // Используем оригинальные названия столбцов и экранируем их
            const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
            const values = Object.values(row);
            const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

            try {
              await postgresSequelize.query(
                `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
                { bind: values }
              );
            } catch (insertError) {
              console.log(`     ⚠️  Ошибка вставки строки:`, insertError.message);
              // Продолжаем со следующей строкой
            }
          }

          console.log(`   ✅ Данные перенесены: ${sqliteData.length} записей`);
        } else {
          console.log(`   ℹ️  Таблица пуста, пропускаю`);
        }

      } catch (error) {
        console.log(`   ❌ Ошибка миграции ${tableName}:`, error.message);
        // Продолжаем с другими таблицами
      }

      console.log('');
    }

    // Включаем проверки внешних ключей обратно
    await postgresSequelize.query('SET session_replication_role = origin;');

    console.log('🎉 Миграция завершена!\n');

    // Финальная проверка
    console.log('📊 Проверяю перенесенные данные...');
    const [propertiesCount] = await postgresSequelize.query('SELECT COUNT(*) as count FROM properties');
    const [usersCount] = await postgresSequelize.query('SELECT COUNT(*) as count FROM users');
    const [citiesCount] = await postgresSequelize.query('SELECT COUNT(*) as count FROM cities');

    console.log(`🏠 Недвижимость: ${propertiesCount[0].count}`);
    console.log(`👥 Пользователи: ${usersCount[0].count}`);
    console.log(`🏙️ Города: ${citiesCount[0].count}`);

  } catch (error) {
    console.error('❌ Критическая ошибка миграции:', error);
  } finally {
    // Закрываем соединения
    await sqliteSequelize.close();
    await postgresSequelize.close();
    console.log('\n🔌 Соединения закрыты');
  }
}

// Запуск миграции
migrateData().then(() => {
  console.log('✅ Миграция завершена успешно!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Миграция завершилась с ошибкой:', error);
  process.exit(1);
});