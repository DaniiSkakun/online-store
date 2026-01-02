const uuid = require('uuid')
const path = require('path');
const {Property, PropertyFeature, PropertyType, District, City, Favorite, User} = require('../models/models')
const {Op} = require('sequelize')
const ApiError = require('../error/ApiError');
const nodemailer = require('nodemailer');

class PropertyController {
    async create(req, res, next) {
        try {
            let {title, price, address, city, area, rooms, floor, total_floors, property_type,
                 description, propertyTypeId, districtId, features} = req.body

            // Нормализуем числовые поля (пустые строки -> null)
            const normalizeNumber = (val) => (val === '' || val === undefined ? null : Number(val));
            floor = normalizeNumber(floor);
            total_floors = normalizeNumber(total_floors);
            const {images} = req.files || {}

            // Обработка изображений
            let imagePaths = []
            if (images) {
                if (Array.isArray(images)) {
                    // Несколько изображений
                    for (let img of images) {
                        let fileName = uuid.v4() + ".jpg"
                        img.mv(path.resolve(__dirname, '..', 'static', fileName))
                        imagePaths.push(fileName)
                    }
                } else {
                    // Одно изображение
                    let fileName = uuid.v4() + ".jpg"
                    images.mv(path.resolve(__dirname, '..', 'static', fileName))
                    imagePaths.push(fileName)
                }
            }

            const property = await Property.create({
                title, price, address, city, area, rooms, floor, total_floors, property_type,
                description, latitude, longitude, propertyTypeId, districtId,
                images: imagePaths, userId: req.user.id
            });

            if (features) {
                features = JSON.parse(features)
                features.forEach(f =>
                    PropertyFeature.create({
                        propertyId: property.id,
                        feature_name: f.name,
                        feature_value: f.value,
                        feature_type: f.type || 'boolean'
                    })
                )
            }

            return res.json(property)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {propertyTypeIds, districtIds, cityIds, search, limit, page, sortBy, sortOrder} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        let whereClause = {}
        let orderClause = []

        // Обработка множественных типов недвижимости
        if (propertyTypeIds) {
            const typeIds = propertyTypeIds.split(',').map(id => parseInt(id))
            console.log('🏠 Фильтр по типам:', typeIds)
            whereClause.propertyTypeId = typeIds
        }

        // Обработка множественных районов
        if (districtIds) {
            const districtIdsArray = districtIds.split(',').map(id => parseInt(id))
            console.log('🏙️ Фильтр по районам:', districtIdsArray)
            whereClause.districtId = districtIdsArray
        }

        // Обработка множественных городов
        if (cityIds) {
            const cityIdsArray = cityIds.split(',').map(id => parseInt(id))
            console.log('🏙️ Фильтр по городам:', cityIdsArray)
            whereClause.cityId = cityIdsArray
        }

        // Обработка поиска
        if (search && search.trim()) {
            console.log('🔍 Поисковый запрос:', search.trim())
            const searchTerm = search.trim()

            // Проверяем, является ли поисковый запрос числом (для поиска по площади или цене)
            const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm))

            if (isNumeric) {
                // Если число, ищем по площади и цене
                const numericValue = parseFloat(searchTerm)
                whereClause[Op.or] = [
                    { area: numericValue },
                    { price: numericValue },
                    // Также ищем в текстовых полях
                    { title: { [Op.like]: `%${searchTerm}%` } },
                    { address: { [Op.like]: `%${searchTerm}%` } },
                    { city: { [Op.like]: `%${searchTerm}%` } }
                ]
            } else {
                // Если текст, ищем только в текстовых полях
                whereClause[Op.or] = [
                    { title: { [Op.like]: `%${searchTerm}%` } },
                    { address: { [Op.like]: `%${searchTerm}%` } },
                    { city: { [Op.like]: `%${searchTerm}%` } }
                ]
            }
        }

        // Обработка сортировки
        if (sortBy && ['price', 'area', 'createdAt'].includes(sortBy)) {
            const order = sortOrder === 'desc' ? 'DESC' : 'ASC'
            orderClause = [[sortBy, order]]
            console.log('🔄 Сортировка:', sortBy, order)
        }

        console.log('📋 Итоговый WHERE:', JSON.stringify(whereClause, null, 2))
        console.log('📋 ORDER:', JSON.stringify(orderClause, null, 2))

        const properties = await Property.findAndCountAll({
            where: whereClause,
            include: [
                {model: PropertyType, as: 'type'},
                {model: District},
                {model: City, as: 'cityModel'}
            ],
            order: orderClause,
            limit,
            offset
        })

        return res.json(properties)
    }

    async getOne(req, res) {
        const {id} = req.params
        const property = await Property.findOne(
            {
                where: {id},
                include: [{model: PropertyFeature, as: 'features'}]
            },
        )
        return res.json(property)
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const property = await Property.findOne({where: {id}})

            if (!property) {
                return next(ApiError.badRequest('Нерухомість не знайдена'))
            }

            // Проверяем права: админ может удалять все, продавец - только свои
            if (req.user.role !== 'ADMIN' && property.userId !== req.user.id) {
                return next(ApiError.forbidden('Нет прав на удаление этой недвижимости'))
            }

            // Удаляем связанные записи из избранного
            await Favorite.destroy({where: {propertyId: id}})
            await PropertyFeature.destroy({where: {propertyId: id}})
            await property.destroy()
            return res.json({message: 'Нерухомість видалена'})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            const property = await Property.findOne({where: {id}})

            if (!property) {
                return next(ApiError.badRequest('Нерухомість не знайдена'))
            }

            // Проверяем права: админ может редактировать все, продавец - только свои
            if (req.user.role !== 'ADMIN' && property.userId !== req.user.id) {
                return next(ApiError.forbidden('Нет прав на редактирование этой недвижимости'))
            }

            let {title, price, address, city, area, rooms, floor, total_floors, property_type,
                 description, propertyTypeId, districtId, existingImages, is_active, features} = req.body

            // Нормализуем числовые поля (пустые строки -> null)
            const normalizeNumber = (val) => (val === '' || val === undefined ? null : Number(val));
            floor = normalizeNumber(floor);
            total_floors = normalizeNumber(total_floors);

            let imagePaths = []

            // Обрабатываем существующие изображения (без падения на невалидном JSON)
            if (existingImages) {
                try {
                    const existingImagesArray = JSON.parse(existingImages)
                    if (Array.isArray(existingImagesArray)) {
                        imagePaths = [...existingImagesArray]
                    }
                } catch (err) {
                    console.warn('⚠️ existingImages parse error:', err.message)
                }
            }

            // Обрабатываем новые изображения
            if (req.files && req.files.images) {
                const {images} = req.files

                if (Array.isArray(images)) {
                    // Несколько новых изображений
                    for (let img of images) {
                        let fileName = uuid.v4() + ".jpg"
                        img.mv(path.resolve(__dirname, '..', 'static', fileName))
                        imagePaths.push(fileName)
                    }
                } else {
                    // Одно новое изображение
                    let fileName = uuid.v4() + ".jpg"
                    images.mv(path.resolve(__dirname, '..', 'static', fileName))
                    imagePaths.push(fileName)
                }
            }

            await property.update({
                title, price, address, city, area, rooms, floor, total_floors, property_type,
                description, propertyTypeId, districtId,
                images: imagePaths, is_active
            })

            // Обновляем характеристики, если пришли
            if (features) {
                try {
                    const parsed = JSON.parse(features)
                    await PropertyFeature.destroy({where: {propertyId: id}})
                    if (Array.isArray(parsed)) {
                        for (const f of parsed) {
                            await PropertyFeature.create({
                                propertyId: id,
                                feature_name: f.name || '',
                                feature_value: f.value || '',
                                feature_type: f.type || 'text'
                            })
                        }
                    }
                } catch (err) {
                    console.warn('⚠️ features parse error:', err.message)
                }
            }

            // Если объект деактивирован, удаляем из избранного всех пользователей
            if (is_active === false) {
                await Favorite.destroy({where: {propertyId: id}})
            }

            return res.json(property)
        } catch (e) {
            console.error('❌ Помилка оновлення нерухомості:', e)
            next(ApiError.badRequest(e.message))
        }
    }

    async contact(req, res, next) {
        try {
            const {id} = req.params;
            const {name, email, message} = req.body;

            if (!message || !message.trim()) {
                return next(ApiError.badRequest('Повідомлення не може бути порожнім'));
            }
            if (!email || !email.trim()) {
                return next(ApiError.badRequest('Вкажіть email для відповіді'));
            }

            const property = await Property.findOne({
                where: {id},
                include: [{model: User, attributes: ['email']}]
            });

            if (!property) {
                return next(ApiError.badRequest('Нерухомість не знайдена'));
            }

            const sellerEmail = property.user?.email;
            if (!sellerEmail) {
                return next(ApiError.badRequest('Email продавця відсутній'));
            }

            // SMTP из .env (берём значения, указанные для почты восстановления, если основные отсутствуют)
            const smtpHost = process.env.SMTP_HOST
                || process.env.MAIL_HOST
                || process.env.EMAIL_HOST;
            const smtpPort = Number(process.env.SMTP_PORT
                || process.env.MAIL_PORT
                || process.env.EMAIL_PORT
                || 587);
            const smtpUser = process.env.SMTP_USER
                || process.env.MAIL_USER
                || process.env.EMAIL_USER;
            const smtpPass = process.env.SMTP_PASSWORD
                || process.env.SMTP_PASS
                || process.env.MAIL_PASSWORD
                || process.env.MAIL_PASS
                || process.env.EMAIL_PASSWORD
                || process.env.EMAIL_PASS;
            const smtpFrom = process.env.SMTP_FROM
                || process.env.MAIL_FROM
                || process.env.EMAIL_FROM
                || smtpUser;

            let transporter;
            if (!smtpHost || !smtpUser || !smtpPass) {
                // Якщо SMTP не налаштований — спробуємо тимчасовий тестовий акаунт (Ethereal)
                try {
                    const testAccount = await nodemailer.createTestAccount();
                    transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        secure: false,
                        auth: {
                            user: testAccount.user,
                            pass: testAccount.pass
                        }
                    });
                } catch (err) {
                    return next(ApiError.badRequest('SMTP тимчасово недоступний. Зверніться до адміністратора.'));
                }
            } else {
                transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: smtpPort === 465, // 465 = SSL, иначе STARTTLS
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });
            }

            const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
            const subject = `Нове повідомлення по об'єкту: ${property.title || ''}`;
            const text = `
Вам надійшло нове повідомлення від користувача:

Ім'я: ${name || '—'}
Email: ${email}

Повідомлення:
${message}

Посилання на оголошення: ${clientUrl}/property/${property.id}
`;

            const html = `
<!doctype html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f7;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f5f7;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:520px;max-width:94%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);border:1px solid #e8e8ee;">
          <tr>
            <td style="padding:20px 24px 12px 24px;border-bottom:1px solid #f0f0f3;">
              <div style="font-size:18px;font-weight:700;color:#1a1a1a;">Нове повідомлення по оголошенню</div>
              <div style="font-size:14px;color:#5f6470;margin-top:6px;">${property.title || 'Оголошення'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;color:#2f343a;font-size:15px;line-height:1.6;">
              <div style="margin-bottom:8px;"><strong>Ім'я:</strong> ${name || '—'}</div>
              <div style="margin-bottom:8px;"><strong>Email:</strong> ${email}</div>
              <div style="margin-bottom:10px;"><strong>Повідомлення:</strong></div>
              <div style="background:#f7f8fb;border:1px solid #e1e5ee;border-radius:10px;padding:12px 14px;color:#2f343a;white-space:pre-wrap;">${message}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 18px 24px;">
              <a href="${clientUrl}/property/${property.id}" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;">Відкрити оголошення</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px 24px;color:#9aa0ad;font-size:12px;line-height:1.4;">
              Цей лист сформовано автоматично. Якщо ви не очікували повідомлення, просто проігноруйте його.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

            await transporter.sendMail({
                from: smtpFrom,
                to: sellerEmail,
                subject,
                text,
                html
            });

            return res.json({message: 'Повідомлення надіслано продавцю'});
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getUserProperties(req, res, next) {
        try {
            console.log('🔍 Получение недвижимости для пользователя:', req.user.id)
            const properties = await Property.findAll({
                where: {userId: req.user.id},
                include: [
                    {model: PropertyFeature, as: 'features'},
                    {model: PropertyType, as: 'type'},
                    {model: District}
                ]
            })
            console.log('📦 Найдено объектов:', properties.length)
            console.log('📋 Первый объект:', properties[0] ? {
                id: properties[0].id,
                title: properties[0].title,
                property_type: properties[0].property_type,
                type: properties[0].type,
                district: properties[0].district
            } : 'Нет объектов')
            return res.json(properties)
        } catch (e) {
            console.error('❌ Ошибка в getUserProperties:', e.message)
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PropertyController()


