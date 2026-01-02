const sequelize = require('../db');
const {Property, City, District} = require('../models/models');

class HealthController {
    async db(req, res, next) {
        try {
            await sequelize.authenticate();
            const dialect = sequelize.getDialect();
            const dbName = sequelize.config?.database || '';
            const [properties, cities, districts] = await Promise.all([
                Property.count(),
                City.count(),
                District.count()
            ]);
            return res.json({
                dialect,
                database: dbName,
                counts: {
                    properties,
                    cities,
                    districts
                }
            });
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new HealthController();
