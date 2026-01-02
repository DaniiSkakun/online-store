import {$authHost, $host} from "../http/index";
import jwt_decode from "jwt-decode";

// Функция для создания админа
export const createAdmin = async () => {
    try {
        console.log('🔧 Создание администратора...');

        // Сначала проверим, можем ли мы получить данные без токена
        const testResponse = await fetch('http://localhost:5000/api/city');
        console.log('🔍 Проверка соединения с сервером:', testResponse.status);

        const response = await $host.post('api/user/registration', {
            email: 'admin@realestate.ua',
            password: 'admin123',
            role: 'ADMIN'
        });

        console.log('📨 Ответ сервера:', response);

        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            const admin = jwt_decode(response.data.token);
            console.log('✅ Админ создан:', admin.email);
            return admin;
        } else {
            throw new Error('Не получен токен от сервера');
        }
    } catch (error) {
        console.error('❌ Помилка створення адміна:', error.response?.data?.message || error.message);
        console.error('📋 Полная ошибка:', error);
        throw error;
    }
};

// Функция для создания городов
export const createCities = async () => {
    const cities = [
        { name: 'Киев' },
        { name: 'Харьков' },
        { name: 'Одесса' },
        { name: 'Днепр' },
        { name: 'Львов' },
        { name: 'Запорожье' },
        { name: 'Кривой Рог' },
        { name: 'Николаев' },
        { name: 'Мариуполь' },
        { name: 'Винница' }
    ];

    console.log('🏙️ Создание городов...');
    for (const city of cities) {
        try {
            await $authHost.post('api/city', city);
            console.log(`✅ Создан город: ${city.name}`);
        } catch (error) {
            console.error(`❌ Помилка створення міста ${city.name}:`, error.response?.data?.message);
        }
    }
};

// Функция для создания районов
export const createDistricts = async () => {
    const districts = [
        // Киев
        { name: 'Печерский', cityId: 1 },
        { name: 'Шевченковский', cityId: 1 },
        { name: 'Подольский', cityId: 1 },
        { name: 'Дарницкий', cityId: 1 },
        { name: 'Оболонский', cityId: 1 },
        { name: 'Святошинский', cityId: 1 },
        { name: 'Голосеевский', cityId: 1 },

        // Харьков
        { name: 'Шевченковский', cityId: 2 },
        { name: 'Киевский', cityId: 2 },
        { name: 'Слободской', cityId: 2 },
        { name: 'Холодногорский', cityId: 2 },

        // Одесса
        { name: 'Приморский', cityId: 3 },
        { name: 'Малиновский', cityId: 3 },
        { name: 'Киевский', cityId: 3 },
        { name: 'Суворовский', cityId: 3 },

        // Днепр
        { name: 'Центральный', cityId: 4 },
        { name: 'Чечеловский', cityId: 4 },
        { name: 'Амур-Нижнеднепровский', cityId: 4 },
        { name: 'Индустриальный', cityId: 4 },

        // Львов
        { name: 'Галицкий', cityId: 5 },
        { name: 'Шевченковский', cityId: 5 },
        { name: 'Франковский', cityId: 5 },
        { name: 'Лычаковский', cityId: 5 }
    ];

    console.log('🏘️ Создание районов...');
    for (const district of districts) {
        try {
            await $authHost.post('api/district', district);
            console.log(`✅ Создан район: ${district.name} (город ${district.cityId})`);
        } catch (error) {
            console.error(`❌ Помилка створення району ${district.name}:`, error.response?.data?.message);
        }
    }
};

// Функция для создания типов недвижимости
export const createPropertyTypes = async () => {
    const types = [
        { name: 'Квартира' },
        { name: 'Дом' },
        { name: 'Коттедж' },
        { name: 'Таунхаус' },
        { name: 'Офис' },
        { name: 'Магазин' },
        { name: 'Склад' },
        { name: 'Земельный участок' }
    ];

    console.log('🏠 Создание типов недвижимости...');
    for (const type of types) {
        try {
            await $authHost.post('api/property-type', type);
            console.log(`✅ Создан тип: ${type.name}`);
        } catch (error) {
            console.error(`❌ Помилка створення типу ${type.name}:`, error.response?.data?.message);
        }
    }
};

// Функция для создания продавцов
export const createSellers = async () => {
    const sellers = [
        { email: 'seller1@realestate.ua', password: 'seller123' },
        { email: 'seller2@realestate.ua', password: 'seller123' },
        { email: 'seller3@realestate.ua', password: 'seller123' },
        { email: 'seller4@realestate.ua', password: 'seller123' },
        { email: 'seller5@realestate.ua', password: 'seller123' },
        { email: 'agent1@realestate.ua', password: 'agent123' },
        { email: 'agent2@realestate.ua', password: 'agent123' },
        { email: 'realtor1@realestate.ua', password: 'realtor123' }
    ];

    console.log('👥 Создание продавцов...');
    const createdSellers = [];

    for (const seller of sellers) {
        try {
            const response = await $host.post('api/user/registration', {
                ...seller,
                role: 'SELLER'
            });
            const sellerData = jwt_decode(response.data.token);
            createdSellers.push(sellerData);
            console.log(`✅ Создан продавец: ${seller.email}`);
        } catch (error) {
            console.error(`❌ Помилка створення продавця ${seller.email}:`, error.response?.data?.message);
        }
    }

    return createdSellers;
};

// Функция для создания недвижимости
export const createProperties = async (sellers) => {
    const properties = [
        // Квартиры в Киеве
        {
            title: 'Просторная 3-комнатная квартира в центре',
            price: 150000,
            address: 'ул. Крещатик, 25',
            city: 'Киев',
            area: 85,
            rooms: 3,
            floor: 5,
            total_floors: 12,
            property_type: 'Квартира',
            description: 'Отличная 3-комнатная квартира в самом центре Киева. Полностью укомплектована мебелью и техникой.',
            propertyTypeId: 1,
            districtId: 1,
            cityId: 1,
            images: []
        },
        {
            title: 'Уютная 2-комнатная квартира с видом на парк',
            price: 95000,
            address: 'ул. Тарасовская, 12',
            city: 'Киев',
            area: 65,
            rooms: 2,
            floor: 8,
            total_floors: 16,
            property_type: 'Квартира',
            description: 'Светлая 2-комнатная квартира с прекрасным видом на парк. Идеально для семьи.',
            propertyTypeId: 1,
            districtId: 2,
            cityId: 1,
            images: []
        },
        {
            title: 'Элитная студия в ЖК "Золотые ворота"',
            price: 75000,
            address: 'ул. Владимирская, 45',
            city: 'Киев',
            area: 35,
            rooms: 1,
            floor: 12,
            total_floors: 25,
            property_type: 'Квартира',
            description: 'Современная студия в элитном жилом комплексе с полной инфраструктурой.',
            propertyTypeId: 1,
            districtId: 1,
            cityId: 1,
            images: []
        },

        // Дома в Харькове
        {
            title: 'Коттедж в экологичном районе',
            price: 280000,
            address: 'ул. Сумская, 150',
            city: 'Харьков',
            area: 180,
            rooms: 5,
            floor: 2,
            total_floors: 2,
            property_type: 'Коттедж',
            description: 'Просторный коттедж с участком 6 соток. Идеально для большой семьи.',
            propertyTypeId: 3,
            districtId: 8,
            cityId: 2,
            images: []
        },
        {
            title: 'Частный дом с гаражом',
            price: 195000,
            address: 'ул. Пушкинская, 78',
            city: 'Харьков',
            area: 120,
            rooms: 4,
            floor: 1,
            total_floors: 1,
            property_type: 'Дом',
            description: 'Уютный дом с гаражом и небольшим садом. Отличное место для жизни.',
            propertyTypeId: 2,
            districtId: 9,
            cityId: 2,
            images: []
        },

        // Офисы в Одессе
        {
            title: 'Офис в бизнес-центре',
            price: 120000,
            address: 'ул. Дерибасовская, 10',
            city: 'Одесса',
            area: 95,
            rooms: 3,
            floor: 3,
            total_floors: 8,
            property_type: 'Офис',
            description: 'Представительский офис в самом центре Одессы. Полностью готов к работе.',
            propertyTypeId: 5,
            districtId: 11,
            cityId: 3,
            images: []
        },

        // Магазины в Днепре
        {
            title: 'Торговое помещение на первой линии',
            price: 220000,
            address: 'пр. Дмитрия Яворницкого, 50',
            city: 'Днепр',
            area: 150,
            rooms: 2,
            floor: 1,
            total_floors: 5,
            property_type: 'Магазин',
            description: 'Отличное торговое помещение с витринными окнами. Высокая проходимость.',
            propertyTypeId: 6,
            districtId: 15,
            cityId: 4,
            images: []
        },

        // Таунхаусы во Львове
        {
            title: 'Современный таунхаус',
            price: 185000,
            address: 'ул. Франко, 25',
            city: 'Львов',
            area: 95,
            rooms: 4,
            floor: 2,
            total_floors: 2,
            property_type: 'Таунхаус',
            description: 'Современный таунхаус в тихом районе Львова. Собственный паркинг.',
            propertyTypeId: 4,
            districtId: 19,
            cityId: 5,
            images: []
        },

        // Земельные участки
        {
            title: 'Участок под строительство',
            price: 45000,
            address: 'ул. Лесная, 1',
            city: 'Киев',
            area: 800,
            rooms: 0,
            floor: 0,
            total_floors: 0,
            property_type: 'Земельный участок',
            description: 'Большой земельный участок в экологичном районе. Подходит для строительства коттеджа.',
            propertyTypeId: 8,
            districtId: 6,
            cityId: 1,
            images: []
        },

        // Склады
        {
            title: 'Производственный склад',
            price: 320000,
            address: 'промзона, ул. Промышленная, 15',
            city: 'Харьков',
            area: 500,
            rooms: 1,
            floor: 1,
            total_floors: 1,
            property_type: 'Склад',
            description: 'Большой склад с подъездными путями. Идеально для производства или хранения.',
            propertyTypeId: 7,
            districtId: 12,
            cityId: 2,
            images: []
        },

        // Еще несколько квартир
        {
            title: '1-комнатная квартира для студентов',
            price: 35000,
            address: 'ул. Студенческая, 8',
            city: 'Киев',
            area: 28,
            rooms: 1,
            floor: 3,
            total_floors: 9,
            property_type: 'Квартира',
            description: 'Компактная студенческая квартира рядом с университетом.',
            propertyTypeId: 1,
            districtId: 2,
            cityId: 1,
            images: []
        },
        {
            title: 'Семейная 4-комнатная квартира',
            price: 210000,
            address: 'ул. Победы, 100',
            city: 'Одесса',
            area: 110,
            rooms: 4,
            floor: 7,
            total_floors: 14,
            property_type: 'Квартира',
            description: 'Просторная семейная квартира с большой кухней и балконом.',
            propertyTypeId: 1,
            districtId: 13,
            cityId: 3,
            images: []
        },
        {
            title: 'Пентхаус с террасой',
            price: 450000,
            address: 'ул. Набережная, 1',
            city: 'Днепр',
            area: 200,
            rooms: 5,
            floor: 20,
            total_floors: 20,
            property_type: 'Квартира',
            description: 'Роскошный пентхаус с панорамным видом на реку и просторной террасой.',
            propertyTypeId: 1,
            districtId: 15,
            cityId: 4,
            images: []
        }
    ];

    console.log('🏠 Создание недвижимости...');

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const seller = sellers[i % sellers.length]; // Распределяем между продавцами

        try {
            // Используем токен продавца для создания недвижимости
            const sellerToken = localStorage.getItem('token');
            // Сохраняем текущий токен админа
            const adminToken = sellerToken;

            // Создаем недвижимость от имени продавца
            const propertyData = {
                ...property,
                userId: seller.id // Указываем ID продавца
            };

            await $authHost.post('api/property', propertyData);
            console.log(`✅ Создана недвижимость: "${property.title}" (продавец: ${seller.email})`);
        } catch (error) {
            console.error(`❌ Помилка створення нерухомості "${property.title}":`, error.response?.data?.message);
        }
    }
};

// Функция для проверки существующих данных
export const checkExistingData = async () => {
    try {
        console.log('🔍 Проверяем существующие данные...');

        const citiesResponse = await $host.get('api/city');
        console.log('🏙️ Существующие города:', citiesResponse.data.length);

        const districtsResponse = await $host.get('api/district');
        console.log('🏘️ Существующие районы:', districtsResponse.data.length);

        const typesResponse = await $host.get('api/property-type');
        console.log('🏷️ Существующие типы:', typesResponse.data.length);

        const propertiesResponse = await $host.get('api/property');
        console.log('🏠 Существующая недвижимость:', propertiesResponse.data.count);

        return {
            cities: citiesResponse.data.length,
            districts: districtsResponse.data.length,
            types: typesResponse.data.length,
            properties: propertiesResponse.data.count
        };
    } catch (error) {
        console.error('❌ Помилка перевірки даних:', error);
        return null;
    }
};

// Основная функция для наполнения базы данных
export const seedDatabase = async () => {
    try {
        console.log('🚀 Начинаем наполнение базы данных...');

        // Проверяем подключение к серверу
        console.log('🔍 Проверяем подключение к серверу...');
        try {
            const testResponse = await fetch('http://localhost:5000/api/city');
            console.log('✅ Сервер доступен, статус:', testResponse.status);
        } catch (connError) {
            console.error('❌ Сервер недоступен:', connError);
            alert('Сервер недоступний! Переконайтеся, що сервер запущений на порту 5000.');
            return;
        }

        // Проверяем существующие данные
        const existingData = await checkExistingData();
        if (existingData) {
            console.log('📊 Текущие данные в БД:', existingData);
        }

        // Создаем админа
        console.log('👤 Создаем админа...');
        const admin = await createAdmin();
        console.log('✅ Админ создан:', admin);

        if (!admin) {
            alert('❌ Не вдалося створити адміна! Перевірте підключення до сервера.');
            return;
        }

        // Создаем справочники (города, районы, типы)
        console.log('🏙️ Создаем города...');
        await createCities();

        console.log('🏘️ Создаем районы...');
        await createDistricts();

        console.log('🏠 Создаем типы недвижимости...');
        await createPropertyTypes();

        // Создаем продавцов
        console.log('👥 Создаем продавцов...');
        const sellers = await createSellers();
        console.log(`✅ Создано ${sellers.length} продавцов`);

        // Создаем недвижимость
        console.log('🏘️ Создаем недвижимость...');
        await createProperties(sellers);

        console.log('✅ База данных успешно наполнена!');
        console.log('📊 Админ: admin@realestate.ua / admin123');
        console.log(`👥 Создано продавцов: ${sellers.length}`);
        console.log('🏠 Создано недвижимости: 15+ объектов');

        alert('✅ База даних успішно наповнена!\n\nАдмін: admin@realestate.ua / admin123');

    } catch (error) {
        console.error('❌ Помилка при наповненні бази даних:', error);
        alert('❌ Помилка при наповненні бази даних: ' + error.message);
    }
};
