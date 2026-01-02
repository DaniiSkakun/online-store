const sequelize = require('./db');
const { City, Property, PropertyType } = require('./models/models');

async function checkData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Підключення до БД успішне');

    console.log('\n🏙️ Міста:');
    const cities = await City.findAll({ limit: 5 });
    cities.forEach(city => console.log('  -', city.name));

    console.log('\n🏠 Типи нерухомості:');
    const types = await PropertyType.findAll();
    types.forEach(type => console.log('  -', type.name));

    console.log('\n🏢 Перші 3 об\'єкти нерухомості:');
    const properties = await Property.findAll({
      limit: 3,
      include: [City, PropertyType]
    });
    properties.forEach(prop => {
      console.log('  📍', prop.title);
      console.log('     Місто:', prop.city?.name || prop.city);
      console.log('     Тип:', prop.property_type);
      console.log('     Ціна:', prop.price, '₽');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Помилка:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkData();
