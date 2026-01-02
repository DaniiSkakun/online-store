const Router = require('express')
const router = new Router()
const propertyController = require('../controllers/propertyController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN', 'SELLER'), propertyController.create)
router.get('/', propertyController.getAll)
router.get('/user', checkRole('ADMIN', 'SELLER'), propertyController.getUserProperties)
router.get('/:id', propertyController.getOne)
router.put('/:id', checkRole('ADMIN', 'SELLER'), propertyController.update)
router.delete('/:id', checkRole('ADMIN', 'SELLER'), propertyController.delete)
router.post('/:id/contact', propertyController.contact)

module.exports = router


