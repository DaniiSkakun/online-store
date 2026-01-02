const Router = require('express')
const router = new Router()
const districtController = require('../controllers/districtController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), districtController.create)
router.get('/', districtController.getAll)
router.delete('/:id', checkRole('ADMIN'), districtController.delete)

module.exports = router
