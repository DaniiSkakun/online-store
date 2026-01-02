const {City, Property, District} = require('../models/models')
const ApiError = require('../error/ApiError');

class CityController {
    async create(req, res) {
        const {name} = req.body
        const city = await City.create({name})
        return res.json(city)
    }

    async getAll(req, res) {
        const cities = await City.findAll()
        return res.json(cities)
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const city = await City.findByPk(id)
            if (!city) {
                return next(ApiError.badRequest('Місто не знайдено'))
            }
            const hasProperties = await Property.count({where: {cityId: id}})
            if (hasProperties > 0) {
                return next(ApiError.badRequest('Спершу видаліть нерухомість цього міста'))
            }
            const hasDistricts = await District.count({where: {cityId: id}})
            if (hasDistricts > 0) {
                return next(ApiError.badRequest('Спершу видаліть райони цього міста'))
            }
            await city.destroy()
            return res.json({message: 'Місто видалено'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new CityController()






