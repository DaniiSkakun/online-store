const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketProperty = sequelize.define('basket_property', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Property = sequelize.define('property', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.DECIMAL(15, 2), allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, allowNull: false},
    cityId: {type: DataTypes.INTEGER, allowNull: true},
    area: {type: DataTypes.DECIMAL(8, 2), allowNull: false}, // площадь в м²
    rooms: {type: DataTypes.INTEGER, allowNull: false}, // количество комнат
    floor: {type: DataTypes.INTEGER}, // этаж
    total_floors: {type: DataTypes.INTEGER}, // общая этажность
    property_type: {type: DataTypes.ENUM('apartment', 'house', 'land', 'office', 'commercial'), allowNull: false},
    description: {type: DataTypes.TEXT},
    latitude: {type: DataTypes.DECIMAL(10, 8)},
    longitude: {type: DataTypes.DECIMAL(11, 8)},
    images: {type: DataTypes.JSON}, // массив путей к изображениям
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    userId: {type: DataTypes.INTEGER, allowNull: false}, // владелец недвижимости
})

const PropertyType = sequelize.define('property_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    slug: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const City = sequelize.define('city', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const District = sequelize.define('district', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    cityId: {type: DataTypes.INTEGER, allowNull: false, references: {model: City, key: 'id'}},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const PropertyFeature = sequelize.define('property_feature', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    feature_name: {type: DataTypes.STRING, allowNull: false}, // например: "Балкон", "Парковка", "Лифт"
    feature_value: {type: DataTypes.STRING}, // значение характеристики
    feature_type: {type: DataTypes.ENUM('boolean', 'text', 'number'), defaultValue: 'boolean'},
})

const Favorite = sequelize.define('favorite', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    propertyId: {type: DataTypes.INTEGER, allowNull: false},
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'propertyId']
        }
    ]
})

const PasswordReset = sequelize.define('password_reset', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false},
    resetCode: {type: DataTypes.STRING, allowNull: false},
    expiresAt: {type: DataTypes.DATE, allowNull: false},
    used: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const PropertyTypeDistrict = sequelize.define('property_type_district', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

User.hasMany(Property)
Property.belongsTo(User)

Basket.hasMany(BasketProperty)
BasketProperty.belongsTo(Basket)

PropertyType.hasMany(Property)
Property.belongsTo(PropertyType, {as: 'type'})

City.hasMany(District)
District.belongsTo(City)

City.hasMany(Property, {foreignKey: 'cityId'})
Property.belongsTo(City, {foreignKey: 'cityId', as: 'cityModel'})

District.hasMany(Property)
Property.belongsTo(District)

Property.hasMany(Rating)
Rating.belongsTo(Property)

Property.hasMany(BasketProperty)
BasketProperty.belongsTo(Property)

Property.hasMany(PropertyFeature, {as: 'features'});
PropertyFeature.belongsTo(Property)

User.hasMany(Favorite)
Favorite.belongsTo(User)

Property.hasMany(Favorite)
Favorite.belongsTo(Property)

User.hasMany(PasswordReset)
PasswordReset.belongsTo(User)

PropertyType.belongsToMany(District, {through: PropertyTypeDistrict })
District.belongsToMany(PropertyType, {through: PropertyTypeDistrict })

module.exports = {
    User,
    Basket,
    BasketProperty,
    Property,
    PropertyType,
    District,
    City,
    Rating,
    PropertyTypeDistrict,
    PropertyFeature,
    Favorite,
    PasswordReset
}





