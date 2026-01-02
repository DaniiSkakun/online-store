const sequelize = require('./db');
const { Favorite } = require('./models/models');

async function checkTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Підключення до БД успішне');

    console.log('\n📊 Структура таблиці favorites:');
    const tableInfo = await sequelize.getQueryInterface().describeTable('favorites');
    Object.keys(tableInfo).forEach(column => {
      const colInfo = tableInfo[column];
      console.log(`  - ${column}: ${colInfo.type}${colInfo.allowNull ? ' (NULL)' : ' (NOT NULL)'}${colInfo.primaryKey ? ' (PRIMARY KEY)' : ''}${colInfo.defaultValue ? ` (DEFAULT: ${colInfo.defaultValue})` : ''}`);
    });

    console.log('\n📋 Записи в таблиці favorites:');
    const favorites = await Favorite.findAll({
      include: [
        { model: require('./models/models').User, attributes: ['email'] },
        { model: require('./models/models').Property, attributes: ['title'] }
      ]
    });

    if (favorites.length === 0) {
      console.log('  ❌ Таблиця порожня - ніхто ще не додавав в обране');
    } else {
      favorites.forEach(fav => {
        console.log(`  ID: ${fav.id} | Користувач: ${fav.user?.email || 'Невідомий'} | Товар: ${fav.property?.title?.substring(0, 30) || 'Невідомий'}...`);
      });
    }

  } catch (error) {
    console.error('❌ Помилка:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTable();
