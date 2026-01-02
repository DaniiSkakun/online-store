const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.post('/request-password-reset', userController.requestPasswordReset)
router.post('/verify-reset-code', userController.verifyResetCode)
router.post('/reset-password', userController.resetPassword)
router.put('/change-password', authMiddleware, userController.changePassword)
router.delete('/delete-account', authMiddleware, userController.deleteAccount)

module.exports = router
