require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`)
    next()
})
app.use('/api', router)

// 404 handler to log missing routes
app.use((req, res, next) => {
    console.warn(`⚠️ 404 ${req.method} ${req.originalUrl}`)
    return res.status(404).json({message: 'Not found', path: req.originalUrl})
})

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync() // Синхронизация базы данных без пересоздания
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
