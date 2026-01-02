require('dotenv').config();

const sequelize = require('./db');
const {
    User,
    Property,
    PropertyType,
    District,
    City,
    PropertyFeature,
} = require('./models/models');
const bcrypt = require('bcrypt');

// Набор тестовых картинок из папки static
const sampleImages = [
    '0c80d66c-3e86-402d-92f4-14f4a0d5d8c7.jpg',
    '0da16062-c12b-4c01-913b-ec3a60ba0b7a.jpg',
    '0edac1f1-766c-4490-9e8e-5dcc81fcb13f.jpg',
    '22e891e4-d020-4006-a60b-2be97b62672e.jpg',
    '25e8795f-cac0-46ed-904a-09cf83337a21.jpg',
    '33b8d5e9-2bbd-488b-8453-0652a3b5c889.jpg',
    '5101f28d-a388-4c0a-9be8-073e9570e99a.jpg',
    '935bb0a5-c599-4e2e-a2f3-373d5c0b9057.jpg',
    '963e7f53-3fb1-40e6-a6ef-5f45802cb72d.jpg',
    'a4be5d23-292c-40c3-96b4-eba60e6e70f2.jpg',
    'b7870f83-1156-4edb-99c2-7e0d952e33d6.jpg',
    'c18e1353-0bf5-4ee3-b589-2f20678b3e12.jpg',
    'd4d0f38e-495d-44ad-af60-bcc9641fcb02.jpg',
    'e1646781-9115-417d-886d-976c2749a023.jpg',
];

const propertyTypesSeed = [
    { name: 'Квартира', slug: 'apartment' },
    { name: 'Будинок', slug: 'house' },
    { name: 'Ділянка', slug: 'land' },
    { name: 'Офіс', slug: 'office' },
    { name: 'Комерційна', slug: 'commercial' },
];

const citiesSeed = [
    { name: 'Київ' },
    { name: 'Одеса' },
    { name: 'Дніпро' },
    { name: 'Харків' },
    { name: 'Львів' },
    { name: 'Запоріжжя' },
    { name: 'Кривий Ріг' },
    { name: 'Миколаїв' },
    { name: 'Херсон' },
    { name: 'Чернігів' },
    { name: 'Полтава' },
    { name: 'Черкаси' },
    { name: 'Житомир' },
    { name: 'Вінниця' },
    { name: 'Суми' },
    { name: 'Рівне' },
    { name: 'Тернопіль' },
    { name: 'Івано-Франківськ' },
    { name: 'Луцьк' },
    { name: 'Ужгород' },
    { name: 'Хмельницький' },
    { name: 'Чернівці' },
];

const districtsSeed = [
    // Київ
    { name: 'Печерський', cityName: 'Київ' },
    { name: 'Подільський', cityName: 'Київ' },
    { name: 'Оболонський', cityName: 'Київ' },
    { name: 'Шевченківський', cityName: 'Київ' },
    { name: 'Голосіївський', cityName: 'Київ' },
    { name: 'Дарницький', cityName: 'Київ' },
    { name: 'Деснянський', cityName: 'Київ' },
    { name: 'Святошинський', cityName: 'Київ' },
    { name: 'Солом\'янський', cityName: 'Київ' },
    { name: 'Центр', cityName: 'Київ' },
    { name: 'Лівобережний', cityName: 'Київ' },

    // Одеса
    { name: 'Приморський', cityName: 'Одеса' },
    { name: 'Малиновський', cityName: 'Одеса' },
    { name: 'Київський', cityName: 'Одеса' },
    { name: 'Суворовський', cityName: 'Одеса' },
    { name: 'Центр Одеси', cityName: 'Одеса' },
    { name: 'Пересип', cityName: 'Одеса' },
    { name: 'Таїрово', cityName: 'Одеса' },
    { name: 'Черемушки', cityName: 'Одеса' },

    // Днепр
    { name: 'Центральный Днепр', cityName: 'Дніпро' },
    { name: 'Чечеловский', cityName: 'Дніпро' },
    { name: 'Амур-Нижнеднепровский', cityName: 'Дніпро' },
    { name: 'Шевченковский Днепр', cityName: 'Дніпро' },
    { name: 'Индустриальный', cityName: 'Дніпро' },
    { name: 'Самарский', cityName: 'Дніпро' },
    { name: 'Красногвардейский', cityName: 'Дніпро' },

    // Харьков
    { name: 'Центральный Харьков', cityName: 'Харків' },
    { name: 'Киевский Харьков', cityName: 'Харків' },
    { name: 'Немышлянский', cityName: 'Харків' },
    { name: 'Основянский', cityName: 'Харків' },
    { name: 'Слободской', cityName: 'Харків' },
    { name: 'Холодногорский', cityName: 'Харків' },
    { name: 'Новобаварский', cityName: 'Харків' },
    { name: 'Индустриальный Харьков', cityName: 'Харків' },

    // Львов
    { name: 'Галицкий', cityName: 'Львів' },
    { name: 'Лычаковский', cityName: 'Львів' },
    { name: 'Шевченковский Львов', cityName: 'Львів' },
    { name: 'Франковский', cityName: 'Львів' },
    { name: 'Зализнычный', cityName: 'Львів' },
    { name: 'Сыховский', cityName: 'Львів' },

    // Запорожье
    { name: 'Александровский', cityName: 'Запоріжжя' },
    { name: 'Вознесеновский', cityName: 'Запоріжжя' },
    { name: 'Днепровский Запорожье', cityName: 'Запоріжжя' },
    { name: 'Заводской', cityName: 'Запоріжжя' },
    { name: 'Коммунарский', cityName: 'Запоріжжя' },
    { name: 'Ленинский Запорожье', cityName: 'Запоріжжя' },
    { name: 'Орджоникидзевский', cityName: 'Запоріжжя' },
    { name: 'Хортицкий', cityName: 'Запоріжжя' },
    { name: 'Шевченковский Запорожье', cityName: 'Запоріжжя' },

    // Кривой Рог
    { name: 'Дзержинский', cityName: 'Кривий Ріг' },
    { name: 'Долгинцевский', cityName: 'Кривий Ріг' },
    { name: 'Жовтневый', cityName: 'Кривий Ріг' },
    { name: 'Ингулецкий', cityName: 'Кривий Ріг' },
    { name: 'Саксаганский', cityName: 'Кривий Ріг' },
    { name: 'Терновский', cityName: 'Кривий Ріг' },

    // Николаев
    { name: 'Центральный Николаев', cityName: 'Миколаїв' },
    { name: 'Заводской Николаев', cityName: 'Миколаїв' },
    { name: 'Корабельный', cityName: 'Миколаїв' },
    { name: 'Ленинский Николаев', cityName: 'Миколаїв' },

    // Херсон
    { name: 'Центр Херсона', cityName: 'Херсон' },
    { name: 'Днепровский Херсон', cityName: 'Херсон' },
    { name: 'Комсомольский', cityName: 'Херсон' },
    { name: 'Суворовский Херсон', cityName: 'Херсон' },

    // Чернигов
    { name: 'Деснянский Чернигов', cityName: 'Чернігів' },
    { name: 'Новозаводской', cityName: 'Чернігів' },
    { name: 'Центр Чернигова', cityName: 'Чернігів' },

    // Полтава
    { name: 'Киевский Полтава', cityName: 'Полтава' },
    { name: 'Ленинский Полтава', cityName: 'Полтава' },
    { name: 'Октябрьский', cityName: 'Полтава' },

    // Черкассы
    { name: 'Днепровский Черкассы', cityName: 'Черкаси' },
    { name: 'Приднепровский', cityName: 'Черкаси' },
    { name: 'Сосновский', cityName: 'Черкаси' },

    // Житомир
    { name: 'Богуния', cityName: 'Житомир' },
    { name: 'Корбутовка', cityName: 'Житомир' },
    { name: 'Малая Березянка', cityName: 'Житомир' },
    { name: 'Центр Житомира', cityName: 'Житомир' },

    // Винница
    { name: 'Замостянский', cityName: 'Вінниця' },
    { name: 'Ленинский Винница', cityName: 'Вінниця' },
    { name: 'Старый город', cityName: 'Вінниця' },

    // Сумы
    { name: 'Засумский', cityName: 'Суми' },
    { name: 'Ковпаковский', cityName: 'Суми' },
    { name: 'Центр Сум', cityName: 'Суми' },

    // Ровно
    { name: 'Южный', cityName: 'Рівне' },
    { name: 'Центр Ровно', cityName: 'Рівне' },
    { name: 'Горынь', cityName: 'Рівне' },

    // Тернополь
    { name: 'Центр Тернополя', cityName: 'Тернопіль' },
    { name: 'Дружба', cityName: 'Тернопіль' },
    { name: 'Новий світ', cityName: 'Тернопіль' },

    // Ивано-Франковск
    { name: 'Центр Ивано-Франковска', cityName: 'Івано-Франківськ' },
    { name: 'Бельведер', cityName: 'Івано-Франківськ' },
    { name: 'Пасічна', cityName: 'Івано-Франківськ' },

    // Луцк
    { name: 'Центр Луцка', cityName: 'Луцьк' },
    { name: 'Верхній', cityName: 'Луцьк' },
    { name: 'Нижній', cityName: 'Луцьк' },

    // Ужгород
    { name: 'Центр Ужгорода', cityName: 'Ужгород' },
    { name: 'Боздош', cityName: 'Ужгород' },
    { name: 'Коритняни', cityName: 'Ужгород' },

    // Хмельницкий
    { name: 'Центр Хмельницкого', cityName: 'Хмельницький' },
    { name: 'Гречаны', cityName: 'Хмельницький' },
    { name: 'Ружична', cityName: 'Хмельницький' },

    // Черновцы
    { name: 'Центр Черновцов', cityName: 'Чернівці' },
    { name: 'Прут', cityName: 'Чернівці' },
    { name: 'Россошаны', cityName: 'Чернівці' },
];

const propertiesSeed = [
    {
        title: 'Просторная 3-комнатная квартира в центре',
        price: 150000,
        address: 'ул. Крещатик, 25',
        cityName: 'Київ',
        area: 85,
        rooms: 3,
        floor: 5,
        total_floors: 12,
        property_type: 'apartment',
        description: 'Светлая квартира в центре города с видом на парк.',
        latitude: null,
        longitude: null,
        images: [sampleImages[0], sampleImages[1]],
        propertyTypeSlug: 'apartment',
        districtName: 'Печерський',
        features: [
            { feature_name: 'Балкон', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Парковка', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Уютная 2-комнатная квартира с видом на парк',
        price: 95000,
        address: 'ул. Тарасовская, 12',
        cityName: 'Київ',
        area: 65,
        rooms: 2,
        floor: 8,
        total_floors: 16,
        property_type: 'apartment',
        description: 'Идеально для семьи: рядом школы, парки, ТРЦ.',
        latitude: null,
        longitude: null,
        images: [sampleImages[2], sampleImages[3]],
        propertyTypeSlug: 'apartment',
        districtName: 'Подільський',
        features: [
            { feature_name: 'Лифт', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Метро рядом', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Элитный пентхаус с террасой',
        price: 420000,
        address: 'ул. Владимирская, 45',
        cityName: 'Київ',
        area: 180,
        rooms: 4,
        floor: 20,
        total_floors: 20,
        property_type: 'apartment',
        description: 'Панорамные окна, терраса, приватный лифт.',
        latitude: null,
        longitude: null,
        images: [sampleImages[4], sampleImages[5]],
        propertyTypeSlug: 'apartment',
        districtName: 'Печерський',
        features: [
            { feature_name: 'Терраса', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Кондиционер', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Частный дом с садом',
        price: 210000,
        address: 'ул. Садовая, 7',
        cityName: 'Київ',
        area: 240,
        rooms: 6,
        floor: 2,
        total_floors: 2,
        property_type: 'house',
        description: 'Большой дом с ухоженным садом и гаражом на 2 авто.',
        latitude: null,
        longitude: null,
        images: [sampleImages[6], sampleImages[7]],
        propertyTypeSlug: 'house',
        districtName: 'Оболонський',
        features: [
            { feature_name: 'Гараж', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Камин', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Офис в центре Одессы',
        price: 120000,
        address: 'ул. Дерибасовская, 10',
        cityName: 'Одеса',
        area: 95,
        rooms: 3,
        floor: 3,
        total_floors: 8,
        property_type: 'office',
        description: 'Представительский офис в бизнес-центре.',
        latitude: null,
        longitude: null,
        images: [sampleImages[8], sampleImages[9]],
        propertyTypeSlug: 'office',
        districtName: 'Приморський',
        features: [
            { feature_name: 'Охрана', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Парковка', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Земельный участок под коттедж',
        price: 55000,
        address: 'ул. Лесная, 1',
        cityName: 'Київ',
        area: 800,
        rooms: 0,
        floor: 0,
        total_floors: 0,
        property_type: 'land',
        description: 'Ровный участок, подведены коммуникации.',
        latitude: null,
        longitude: null,
        images: [sampleImages[10]],
        propertyTypeSlug: 'land',
        districtName: 'Оболонський',
        features: [
            { feature_name: 'Коммуникации', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Коммерческое помещение на первой линии',
        price: 230000,
        address: 'пр. Дмитрия Яворницкого, 50',
        cityName: 'Дніпро',
        area: 150,
        rooms: 2,
        floor: 1,
        total_floors: 5,
        property_type: 'commercial',
        description: 'Высокая проходимость, витринные окна.',
        latitude: null,
        longitude: null,
        images: [sampleImages[11], sampleImages[12]],
        propertyTypeSlug: 'commercial',
        districtName: 'Центральный Днепр',
        features: [
            { feature_name: 'Витрина', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Сигнализация', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Лофт в Харькове',
        price: 98000,
        address: 'ул. Сумская, 150',
        cityName: 'Харків',
        area: 70,
        rooms: 2,
        floor: 4,
        total_floors: 9,
                property_type: 'apartment',
        description: 'Современный лофт с высокими потолками.',
        latitude: null,
        longitude: null,
        images: [sampleImages[13], sampleImages[0]],
        propertyTypeSlug: 'apartment',
        districtName: 'Центральный Харьков',
        features: [
            { feature_name: 'Высокие потолки', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Студия в центре Львова',
        price: 85000,
        address: 'площадь Рынок, 8',
        cityName: 'Львів',
        area: 35,
        rooms: 1,
        floor: 2,
        total_floors: 5,
        property_type: 'apartment',
        description: 'Уютная студия в историческом центре Львова.',
        latitude: null,
        longitude: null,
        images: [sampleImages[1], sampleImages[2]],
        propertyTypeSlug: 'apartment',
        districtName: 'Галицкий',
        features: [
            { feature_name: 'Центр города', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Трехкомнатная квартира в Запорожье',
        price: 72000,
        address: 'пр. Соборный, 45',
        cityName: 'Запоріжжя',
        area: 75,
        rooms: 3,
        floor: 7,
        total_floors: 12,
        property_type: 'apartment',
        description: 'Просторная квартира в новом жилом комплексе.',
        latitude: null,
        longitude: null,
        images: [sampleImages[3], sampleImages[4]],
        propertyTypeSlug: 'apartment',
        districtName: 'Александровский',
        features: [
            { feature_name: 'Новая застройка', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Парковка', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Частный дом в Кривом Роге',
        price: 180000,
        address: 'ул. Металлургов, 22',
        cityName: 'Кривий Ріг',
        area: 150,
        rooms: 5,
        floor: 1,
        total_floors: 1,
        property_type: 'house',
        description: 'Кирпичный дом с участком в тихом районе.',
        latitude: null,
        longitude: null,
        images: [sampleImages[5], sampleImages[6]],
        propertyTypeSlug: 'house',
        districtName: 'Дзержинский',
        features: [
            { feature_name: 'Участок', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Гараж', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Офис в Николаеве',
        price: 95000,
        address: 'пр. Ленина, 75',
        cityName: 'Миколаїв',
        area: 85,
        rooms: 3,
        floor: 4,
        total_floors: 8,
        property_type: 'office',
        description: 'Представительский офис в деловом центре.',
        latitude: null,
        longitude: null,
        images: [sampleImages[7], sampleImages[8]],
        propertyTypeSlug: 'office',
        districtName: 'Центральный Николаев',
        features: [
            { feature_name: 'Кондиционер', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Охрана', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Квартира в Херсоне',
        price: 65000,
        address: 'ул. Ушакова, 12',
        cityName: 'Херсон',
        area: 55,
        rooms: 2,
        floor: 3,
        total_floors: 9,
        property_type: 'apartment',
        description: 'Светлая квартира недалеко от набережной.',
        latitude: null,
        longitude: null,
        images: [sampleImages[9], sampleImages[10]],
        propertyTypeSlug: 'apartment',
        districtName: 'Центр Херсона',
        features: [
            { feature_name: 'Вид на реку', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Коммерческое помещение в Чернигове',
        price: 145000,
        address: 'пр. Мира, 28',
        cityName: 'Чернігів',
        area: 120,
        rooms: 2,
        floor: 1,
        total_floors: 4,
        property_type: 'commercial',
        description: 'Помещение на первой линии в центре города.',
        latitude: null,
        longitude: null,
        images: [sampleImages[11], sampleImages[12]],
        propertyTypeSlug: 'commercial',
        districtName: 'Центр Чернигова',
        features: [
            { feature_name: 'Витрина', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Высокая проходимость', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Участок под строительство в Полтаве',
        price: 45000,
        address: 'ул. Киевская, 5',
        cityName: 'Полтава',
        area: 600,
        rooms: 0,
        floor: 0,
        total_floors: 0,
        property_type: 'land',
        description: 'Ровный участок с коммуникациями.',
        latitude: null,
        longitude: null,
        images: [sampleImages[13]],
        propertyTypeSlug: 'land',
        districtName: 'Киевский Полтава',
        features: [
            { feature_name: 'Коммуникации', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Электричество', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Двухкомнатная квартира в Черкассах',
        price: 58000,
        address: 'ул. Байды Вишневецкого, 18',
        cityName: 'Черкаси',
        area: 50,
        rooms: 2,
        floor: 5,
        total_floors: 9,
        property_type: 'apartment',
        description: 'Удобная квартира в спальном районе.',
        latitude: null,
        longitude: null,
        images: [sampleImages[0], sampleImages[1]],
        propertyTypeSlug: 'apartment',
        districtName: 'Днепровский Черкассы',
        features: [
            { feature_name: 'Лифт', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Офис в Житомире',
        price: 78000,
        address: 'ул. Киевская, 77',
        cityName: 'Житомир',
        area: 65,
        rooms: 2,
        floor: 3,
        total_floors: 6,
        property_type: 'office',
        description: 'Комфортный офис в административном здании.',
        latitude: null,
        longitude: null,
        images: [sampleImages[2], sampleImages[3]],
        propertyTypeSlug: 'office',
        districtName: 'Центр Житомира',
        features: [
            { feature_name: 'Интернет', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Квартира в Виннице',
        price: 62000,
        address: 'ул. Соборная, 42',
        cityName: 'Вінниця',
        area: 48,
        rooms: 2,
        floor: 4,
        total_floors: 10,
        property_type: 'apartment',
        description: 'Современная квартира в центре Винницы.',
        latitude: null,
        longitude: null,
        images: [sampleImages[4], sampleImages[5]],
        propertyTypeSlug: 'apartment',
        districtName: 'Старый город',
        features: [
            { feature_name: 'Современный ремонт', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Дом в Сумы',
        price: 125000,
        address: 'ул. Петропавловская, 15',
        cityName: 'Суми',
        area: 120,
        rooms: 4,
        floor: 1,
        total_floors: 1,
        property_type: 'house',
        description: 'Коттедж в зеленом районе города.',
        latitude: null,
        longitude: null,
        images: [sampleImages[6], sampleImages[7]],
        propertyTypeSlug: 'house',
        districtName: 'Засумский',
        features: [
            { feature_name: 'Сад', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Терраса', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Квартира в Ровно',
        price: 55000,
        address: 'ул. Киевская, 25',
        cityName: 'Рівне',
        area: 42,
        rooms: 1,
        floor: 3,
        total_floors: 5,
        property_type: 'apartment',
        description: 'Компактная квартира-студия.',
        latitude: null,
        longitude: null,
        images: [sampleImages[8], sampleImages[9]],
        propertyTypeSlug: 'apartment',
        districtName: 'Центр Ровно',
        features: [
            { feature_name: 'Студия', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Коммерческое помещение в Тернополе',
        price: 110000,
        address: 'ул. Руська, 18',
        cityName: 'Тернопіль',
        area: 90,
        rooms: 1,
        floor: 1,
        total_floors: 3,
        property_type: 'commercial',
        description: 'Помещение в историческом центре.',
        latitude: null,
        longitude: null,
        images: [sampleImages[10], sampleImages[11]],
        propertyTypeSlug: 'commercial',
        districtName: 'Центр Тернополя',
        features: [
            { feature_name: 'Историческое здание', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Квартира в Ивано-Франковске',
        price: 68000,
        address: 'ул. Независимости, 12',
        cityName: 'Івано-Франківськ',
        area: 52,
        rooms: 2,
        floor: 4,
        total_floors: 8,
        property_type: 'apartment',
        description: 'Светлая квартира с видом на горы.',
        latitude: null,
        longitude: null,
        images: [sampleImages[12], sampleImages[13]],
        propertyTypeSlug: 'apartment',
        districtName: 'Центр Ивано-Франковска',
        features: [
            { feature_name: 'Вид на горы', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Офис в Луцке',
        price: 85000,
        address: 'пр. Победы, 8',
        cityName: 'Луцьк',
        area: 70,
        rooms: 3,
        floor: 2,
        total_floors: 5,
        property_type: 'office',
        description: 'Современный офис в бизнес-центре.',
        latitude: null,
        longitude: null,
        images: [sampleImages[0], sampleImages[1]],
        propertyTypeSlug: 'office',
        districtName: 'Центр Луцка',
        features: [
            { feature_name: 'Бизнес-центр', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Парковка', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Участок в Ужгороде',
        price: 35000,
        address: 'ул. Минайская, 3',
        cityName: 'Ужгород',
        area: 400,
        rooms: 0,
        floor: 0,
        total_floors: 0,
        property_type: 'land',
        description: 'Участок для строительства в живописном районе.',
        latitude: null,
        longitude: null,
        images: [sampleImages[2]],
        propertyTypeSlug: 'land',
        districtName: 'Центр Ужгорода',
        features: [
            { feature_name: 'Живописное место', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Квартира в Хмельницком',
        price: 53000,
        address: 'ул. Проскуровская, 14',
        cityName: 'Хмельницький',
        area: 45,
        rooms: 1,
        floor: 5,
        total_floors: 9,
        property_type: 'apartment',
        description: 'Однокомнатная квартира в новом доме.',
        latitude: null,
        longitude: null,
        images: [sampleImages[3], sampleImages[4]],
        propertyTypeSlug: 'apartment',
        districtName: 'Центр Хмельницкого',
        features: [
            { feature_name: 'Новая застройка', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
    {
        title: 'Дом в Черновцах',
        price: 165000,
        address: 'ул. Главная, 27',
        cityName: 'Чернівці',
        area: 140,
        rooms: 4,
        floor: 1,
        total_floors: 1,
        property_type: 'house',
        description: 'Красивый дом в стиле модерн.',
        latitude: null,
        longitude: null,
        images: [sampleImages[5], sampleImages[6]],
        propertyTypeSlug: 'house',
        districtName: 'Центр Черновцов',
        features: [
            { feature_name: 'Архитектурный стиль', feature_value: 'true', feature_type: 'boolean' },
            { feature_name: 'Балкон', feature_value: 'true', feature_type: 'boolean' },
        ],
    },
];

async function seed() {
    try {
        console.log('🔌 Подключение к БД...');
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('✅ Подключено.');

        // Создаем администратора (владельца объявлений)
        const adminPassword = await bcrypt.hash('admin123', 5);
        const admin = await User.create({
            email: 'admin@realestate.ua',
            password: adminPassword,
            role: 'ADMIN',
        });

        // Создаем справочники
        const typesMap = {};
        for (const t of propertyTypesSeed) {
            const record = await PropertyType.findOrCreate({ where: { slug: t.slug }, defaults: t });
            typesMap[t.slug] = record[0];
        }

        const citiesMap = {};
        for (const c of citiesSeed) {
            const record = await City.findOrCreate({ where: { name: c.name }, defaults: c });
            citiesMap[c.name] = record[0];
        }

        const districtsMap = {};
        for (const d of districtsSeed) {
            const city = citiesMap[d.cityName];
            const record = await District.findOrCreate({
                where: { name: d.name, cityId: city.id },
                defaults: { name: d.name, cityId: city.id },
            });
            districtsMap[d.name] = record[0];
        }

        // Создаем объекты недвижимости
        for (const p of propertiesSeed) {
            const propertyType = typesMap[p.propertyTypeSlug];
            const district = districtsMap[p.districtName];
            const city = citiesMap[p.cityName];

            if (!district) {
                console.error('❌ Район не найден:', p.districtName, 'для города:', p.cityName);
                continue;
            }

            const created = await Property.create({
                title: p.title,
                price: p.price,
                address: p.address,
                city: p.cityName,
                cityId: city.id,
                area: p.area,
                rooms: p.rooms,
                floor: p.floor,
                total_floors: p.total_floors,
                property_type: p.property_type,
                description: p.description,
                latitude: p.latitude,
                longitude: p.longitude,
                images: p.images,
                userId: admin.id,
                propertyTypeId: propertyType.id,
                districtId: district.id,
            });

            if (p.features && p.features.length) {
                for (const f of p.features) {
                await PropertyFeature.create({
                        propertyId: created.id,
                        feature_name: f.feature_name,
                        feature_value: f.feature_value,
                        feature_type: f.feature_type,
                    });
                }
            }
        }

        console.log('🎉 Данные успешно добавлены.');
        process.exit(0);
    } catch (e) {
        console.error('❌ Ошибка при наполнении БД:', e);
        process.exit(1);
    }
}

seed();
