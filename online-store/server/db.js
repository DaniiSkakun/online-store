const {Sequelize} = require('sequelize')

// По умолчанию используем PostgreSQL из .env.
// SQLite включится только если USE_SQLITE=1 И нет настроек Postgres (DB_HOST не задан).
const useSqlite = process.env.USE_SQLITE === '1' && !process.env.DB_HOST;

if (useSqlite) {
    module.exports = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    })
} else {
    module.exports = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            dialect: 'postgres',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            logging: false
        }
    )
}
