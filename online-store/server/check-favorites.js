const sequelize = require('./db');
const { Favorite, User, Property } = require('./models/models');

async function checkFavorites() {
  try {
    await sequelize.authenticate();
    console.log('✅ Підключення до БД успішне');

    // Проверим, есть ли записи в favorites
    const favorites = await Favorite.findAll({
      include: [
        { model: User, attributes: ['email'] },
        { model: Property, attributes: ['title', 'price'] }
      ]
    });

    console.log('📊 Кількість записів в обраному:', favorites.length);

    if (favorites.length > 0) {
      console.log('📋 Перші записи:');
      favorites.slice(0, 3).forEach(fav => {
        console.log('  👤 Користувач:', fav.user?.email || 'Невідомий');
        console.log('  🏠 Нерухомість:', fav.property?.title || 'Невідома');
        console.log('  💰 Ціна:', fav.property?.price || 'Невідома');
        console.log('');
      });
    } else {
      console.log('❌ Обране порожнє - користувачі ще не додавали нічого');
      console.log('💡 Спробуйте додати щось в обране через інтерфейс!');
    }

  } catch (error) {
    console.error('❌ Помилка при перевірці обраного:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkFavorites();
