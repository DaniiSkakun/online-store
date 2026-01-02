const Router = require('express')
const router = new Router()
const favoriteController = require('../controllers/favoriteController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, favoriteController.addToFavorite)
router.delete('/:propertyId', authMiddleware, favoriteController.removeFromFavorite)
router.get('/', authMiddleware, favoriteController.getUserFavorites)
router.get('/check/:propertyId', authMiddleware, favoriteController.checkFavorite)

module.exports = router
