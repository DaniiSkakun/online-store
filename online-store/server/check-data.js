const sequelize = require('./db');
const { User, Property, Favorite } = require('./models/models');

async function checkData() {
  try {
    await sequelize.authenticate();
    console.log('✅ База даних підключена');

    console.log('\n👥 Користувачі:');
    const users = await User.findAll();
    users.forEach(user => {
      console.log(`  ID: ${user.id} | Email: ${user.email} | Роль: ${user.role}`);
    });

    console.log('\n🏠 Нерухомість:');
    const properties = await Property.findAll({ limit: 3 });
    properties.forEach(prop => {
      console.log(`  ID: ${prop.id} | Назва: ${prop.title.substring(0, 40)}... | Ціна: ${prop.price}₴`);
    });

    console.log('\n⭐ Ізбранне:');
    const favorites = await Favorite.findAll({
      include: [
        { model: User, attributes: ['email'] },
        { model: Property, attributes: ['title'] }
      ]
    });

    if (favorites.length === 0) {
      console.log('  ❌ Немає записів в обраному');
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

checkData();