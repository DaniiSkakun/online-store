const Router = require('express')
const router = new Router()
const propertyTypeController = require('../controllers/propertyTypeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), propertyTypeController.create)
router.get('/', propertyTypeController.getAll)
router.delete('/:id', checkRole('ADMIN'), propertyTypeController.delete)

module.exports = router
