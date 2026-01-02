const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

async function main() {
  const updates = [
    "update cities set name='Київ' where name='Киев'",
    "update cities set name='Одеса' where name='Одесса'",
    "update cities set name='Дніпро' where name='Днепр'",
    "update cities set name='Харків' where name='Харьков'",
    "update districts set name='Печерський' where name='Печерский'",
    "update districts set name='Подільський' where name='Подольский'",
    "update districts set name='Оболонський' where name='Оболонский'",
    "update districts set name='Приморський' where name='Приморский'",
    "update districts set name='Центральний Дніпро' where name='Центральный Днепр'",
    "update districts set name='Центральний Харків' where name in ('Центральный Харьков','Центральный Харків')",
  ];

  const cityUpdates = [
    "update properties set city='Київ' where city='Киев'",
    "update properties set city='Одеса' where city='Одесса'",
    "update properties set city='Дніпро' where city='Днепр'",
    "update properties set city='Харків' where city='Харьков'",
  ];

  const addrRepl = [
    ['ул. ', 'вул. '],
    ['ул.', 'вул.'],
    ['пр. ', 'просп. '],
    ['пр.', 'просп.'],
  ];

  try {
    for (const q of updates) {
      await db.query(q);
    }
    for (const q of cityUpdates) {
      await db.query(q);
    }
    for (const [from, to] of addrRepl) {
      await db.query(
        `update properties set address = replace(address, '${from}','${to}') where address like '%${from}%'`
      );
    }

    const [cities] = await db.query('select name from cities order by id');
    const [districts] = await db.query('select name from districts order by id limit 10');
    const [props] = await db.query('select city,address from properties limit 5');
    console.log('Cities:', cities.map((c) => c.name));
    console.log('Districts sample:', districts.map((d) => d.name));
    console.log('Props sample:', props.map((p) => ({ city: p.city, address: p.address })));
  } catch (e) {
    console.error('Update error:', e.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
