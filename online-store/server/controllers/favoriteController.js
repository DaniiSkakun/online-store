const {Favorite, Property} = require('../models/models')
const ApiError = require('../error/ApiError')

class FavoriteController {
    // Добавить в избранное
    async addToFavorite(req, res, next) {
        try {
            const {propertyId} = req.body
            const userId = req.user.id

            // Проверяем, не добавлено ли уже в избранное
            const existingFavorite = await Favorite.findOne({
                where: { userId, propertyId }
            })

            if (existingFavorite) {
                return next(ApiError.badRequest('Об\'єкт вже в обраному'))
            }

            const favorite = await Favorite.create({ userId, propertyId })
            return res.json(favorite)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Удалить из избранного
    async removeFromFavorite(req, res, next) {
        try {
            const {propertyId} = req.params
            const userId = req.user.id

            const favorite = await Favorite.findOne({
                where: { userId, propertyId }
            })

            if (!favorite) {
                return next(ApiError.badRequest('Об\'єкт не знайдено в обраному'))
            }

            await favorite.destroy()
            return res.json({ message: 'Видалено з обраного' })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Получить избранное пользователя
    async getUserFavorites(req, res, next) {
        try {
            const userId = req.user.id

            const favorites = await Favorite.findAll({
                where: { userId },
                include: [{
                    model: Property,
                    where: { is_active: true }, // Только активные объекты
                    include: [
                        { model: require('../models/models').PropertyType, as: 'type' },
                        { model: require('../models/models').City, as: 'cityModel' },
                        { model: require('../models/models').District }
                    ]
                }]
            })

            return res.json(favorites)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // Проверить, в избранном ли объект
    async checkFavorite(req, res, next) {
        try {
            const {propertyId} = req.params
            const userId = req.user.id

            const favorite = await Favorite.findOne({
                where: { userId, propertyId }
            })

            return res.json({ isFavorite: !!favorite })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new FavoriteController()
