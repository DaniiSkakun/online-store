const {PropertyType} = require('../models/models')
const ApiError = require('../error/ApiError');
const { PropertyTypeDistrict } = require('../models/models');

class PropertyTypeController {
    async create(req, res, next) {
        try {
            const {name, slug} = req.body
            if (!name || !name.trim()) {
                return next(ApiError.badRequest('Назва типу обовʼязкова'))
            }

            const slugify = (value = '') => {
                const map = {
                    а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', є:'ie', ж:'zh', з:'z', и:'y', і:'i', ї:'i', й:'i',
                    к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch',
                    ш:'sh', щ:'shch', ю:'yu', я:'ya', ы:'y', э:'e', ъ:'', ь:'', ґ:'g'
                };
                return value
                    .toLowerCase()
                    .replace(/[а-яёіїєґ]/g, ch => map[ch] ?? ch)
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .slice(0, 50) || null;
            };

            const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);
            if (!finalSlug) {
                return next(ApiError.badRequest('Slug не може бути порожнім'))
            }

            const propertyType = await PropertyType.create({name: name.trim(), slug: finalSlug})
            return res.json(propertyType)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const propertyTypes = await PropertyType.findAll()
        return res.json(propertyTypes)
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const type = await PropertyType.findByPk(id)
            if (!type) {
                return next(ApiError.badRequest('Тип не знайдено'))
            }
            await PropertyTypeDistrict.destroy({where: {propertyTypeId: id}})
            await type.destroy()
            return res.json({message: 'Тип видалено'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new PropertyTypeController()








