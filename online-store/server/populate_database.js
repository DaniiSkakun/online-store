const API_BASE = 'http://localhost:5000/api';

// Функция для создания админа
async function createAdmin() {
    try {
        console.log('🔧 Создание администратора...');
        const response = await fetch(`${API_BASE}/user/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@realestate.ua',
                password: 'admin123',
                role: 'ADMIN'
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка создания админа');
        }

        const token = data.token;
        console.log('✅ Админ создан, токен получен');
        return token;
    } catch (error) {
        console.error('❌ Ошибка создания админа:', error.message);
        throw error;
    }
}

// Функция для создания городов
async function createCities(token) {
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

    const cityIds = {};

    for (const city of cities) {
        try {
            const response = await fetch(`${API_BASE}/city`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(city)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка создания города');
            }

            cityIds[city.name] = data.id;
            console.log(`✅ Создан город: ${city.name} (ID: ${data.id})`);
        } catch (error) {
            console.error(`❌ Ошибка создания города ${city.name}:`, error.message);
        }
    }

    return cityIds;
}

// Функция для создания районов
async function createDistricts(token, cityIds) {
    const districts = [
        // Киев
        { name: 'Печерский', cityId: cityIds['Киев'] },
        { name: 'Шевченковский', cityId: cityIds['Киев'] },
        { name: 'Подольский', cityId: cityIds['Киев'] },
        { name: 'Дарницкий', cityId: cityIds['Киев'] },
        { name: 'Оболонский', cityId: cityIds['Киев'] },

        // Харьков
        { name: 'Шевченковский', cityId: cityIds['Харьков'] },
        { name: 'Киевский', cityId: cityIds['Харьков'] },
        { name: 'Слободской', cityId: cityIds['Харьков'] },

        // Одесса
        { name: 'Приморский', cityId: cityIds['Одесса'] },
        { name: 'Малиновский', cityId: cityIds['Одесса'] },
        { name: 'Киевский', cityId: cityIds['Одесса'] },

        // Днепр
        { name: 'Центральный', cityId: cityIds['Днепр'] },
        { name: 'Чечеловский', cityId: cityIds['Днепр'] },
        { name: 'Индустриальный', cityId: cityIds['Днепр'] },

        // Львов
        { name: 'Галицкий', cityId: cityIds['Львов'] },
        { name: 'Шевченковский', cityId: cityIds['Львов'] },
        { name: 'Франковский', cityId: cityIds['Львов'] }
    ];

    console.log('🏘️ Создание районов...');
    for (const district of districts) {
        try {
            const response = await fetch(`${API_BASE}/district`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(district)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка создания района');
            }

            console.log(`✅ Создан район: ${district.name}`);
        } catch (error) {
            console.error(`❌ Ошибка создания района ${district.name}:`, error.message);
        }
    }
}

// Функция для создания типов недвижимости
async function createPropertyTypes(token) {
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

    const typeIds = {};

    for (const type of types) {
        try {
            const response = await fetch(`${API_BASE}/property-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(type)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка создания типа');
            }

            typeIds[type.name] = data.id;
            console.log(`✅ Создан тип: ${type.name} (ID: ${data.id})`);
        } catch (error) {
            console.error(`❌ Ошибка создания типа ${type.name}:`, error.message);
        }
    }

    return typeIds;
}

// Функция для создания продавцов
async function createSellers() {
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

    const sellerTokens = {};

    for (const seller of sellers) {
        try {
            const response = await fetch(`${API_BASE}/user/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...seller,
                    role: 'SELLER'
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка создания продавца');
            }

            sellerTokens[seller.email] = data.token;
            console.log(`✅ Создан продавец: ${seller.email}`);
        } catch (error) {
            console.error(`❌ Ошибка создания продавца ${seller.email}:`, error.message);
        }
    }

    return sellerTokens;
}

// Функция для создания недвижимости
async function createProperties(sellerTokens, typeIds, cityIds) {
    const baseProperties = [
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
            propertyTypeId: typeIds['Квартира'],
            districtId: 1,
            cityId: cityIds['Киев']
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
            propertyTypeId: typeIds['Квартира'],
            districtId: 2,
            cityId: cityIds['Киев']
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
            propertyTypeId: typeIds['Квартира'],
            districtId: 1,
            cityId: cityIds['Киев']
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
            propertyTypeId: typeIds['Коттедж'],
            districtId: 6,
            cityId: cityIds['Харьков']
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
            propertyTypeId: typeIds['Дом'],
            districtId: 7,
            cityId: cityIds['Харьков']
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
            propertyTypeId: typeIds['Офис'],
            districtId: 9,
            cityId: cityIds['Одесса']
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
            propertyTypeId: typeIds['Магазин'],
            districtId: 12,
            cityId: cityIds['Днепр']
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
            propertyTypeId: typeIds['Таунхаус'],
            districtId: 15,
            cityId: cityIds['Львов']
        }
    ];

    console.log('🏠 Создание недвижимости...');

    const sellerEmails = Object.keys(sellerTokens);
    let propertyCount = 0;

    for (let i = 0; i < baseProperties.length; i++) {
        const property = baseProperties[i];
        const sellerEmail = sellerEmails[i % sellerEmails.length];
        const sellerToken = sellerTokens[sellerEmail];

        try {
            const response = await fetch(`${API_BASE}/property`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sellerToken}`
                },
                body: JSON.stringify(property)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка создания недвижимости');
            }

            propertyCount++;
            console.log(`✅ Создана недвижимость: "${property.title}" (${sellerEmail})`);
        } catch (error) {
            console.error(`❌ Ошибка создания недвижимости "${property.title}":`, error.message);
        }
    }

    console.log(`✅ Создано ${propertyCount} объектов недвижимости`);
}

// Основная функция
async function populateDatabase() {
    try {
        console.log('🚀 Начинаем наполнение базы данных...\n');

        // Создаем админа
        const adminToken = await createAdmin();
        console.log('');

        // Создаем справочники
        const cityIds = await createCities(adminToken);
        console.log('');

        await createDistricts(adminToken, cityIds);
        console.log('');

        const typeIds = await createPropertyTypes(adminToken);
        console.log('');

        // Создаем продавцов
        const sellerTokens = await createSellers();
        console.log('');

        // Создаем недвижимость
        await createProperties(sellerTokens, typeIds, cityIds);
        console.log('');

        console.log('🎉 База данных успешно наполнена!');
        console.log('📊 Админ: admin@realestate.ua / admin123');
        console.log(`👥 Создано продавцов: ${Object.keys(sellerTokens).length}`);
        console.log('🏠 Создано недвижимости: 9+ объектов');
        console.log('🏙️ Создано городов: 10');
        console.log('🏘️ Создано районов: 17');
        console.log('🏷️ Создано типов недвижимости: 8');

    } catch (error) {
        console.error('❌ Критическая ошибка при наполнении базы данных:', error.message);
        process.exit(1);
    }
}

// Запускаем наполнение
populateDatabase();
