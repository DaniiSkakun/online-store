const Router = require('express')
const router = new Router()
const propertyRouter = require('./propertyRouter')
const userRouter = require('./userRouter')
const districtRouter = require('./districtRouter')
const cityRouter = require('./cityRouter')
const propertyTypeRouter = require('./propertyTypeRouter')
const favoriteRouter = require('./favoriteRouter')
const healthRouter = require('./healthRouter')

router.use('/user', userRouter)
router.use('/property-type', propertyTypeRouter)
router.use('/district', districtRouter)
router.use('/city', cityRouter)
router.use('/property', propertyRouter)
router.use('/favorite', favoriteRouter)
router.use('/health', healthRouter)

module.exports = router
