const {District, Property, PropertyTypeDistrict, City} = require('../models/models')
const ApiError = require('../error/ApiError');

class DistrictController {
    async create(req, res, next) {
        try {
            const {name, cityId} = req.body
            if (!name || !name.trim()) {
                return next(ApiError.badRequest('Назва району обовʼязкова'))
            }
            if (!cityId) {
                return next(ApiError.badRequest('cityId обовʼязковий'))
            }
            const city = await City.findByPk(cityId)
            if (!city) {
                return next(ApiError.badRequest('Місто не знайдено'))
            }
            const district = await District.create({name: name.trim(), cityId})
            return res.json(district)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const districts = await District.findAll()
        return res.json(districts)
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const district = await District.findByPk(id)
            if (!district) {
                return next(ApiError.badRequest('Район не знайдено'))
            }
            const hasProperties = await Property.count({where: {districtId: id}})
            if (hasProperties > 0) {
                return next(ApiError.badRequest('Спершу видаліть нерухомість цього району'))
            }
            await PropertyTypeDistrict.destroy({where: {districtId: id}})
            await district.destroy()
            return res.json({message: 'Район видалено'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new DistrictController()








