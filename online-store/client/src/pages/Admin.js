import React, {useState, useEffect, useContext, useMemo} from 'react';
import {Button, Container, Row, Col, Card, Form} from "react-bootstrap";
import CreateDistrict from "../components/modals/CreateDistrict";
import CreateCity from "../components/modals/CreateCity";
import CreateProperty from "../components/modals/CreateProperty";
import CreatePropertyType from "../components/modals/CreatePropertyType";
import EditProperty from "../components/modals/EditProperty";
import PropertyItem from "../components/PropertyItem";
import {seedDatabase} from "../utils/seedDatabase";
import {
    fetchProperties,
    deleteProperty,
    fetchCities,
    fetchDistricts,
    fetchPropertyTypes,
    deleteCity,
    deleteDistrict,
    deletePropertyType
} from "../http/propertyAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Admin = observer(() => {
    const {user, property} = useContext(Context);
    const [districtVisible, setDistrictVisible] = useState(false);
    const [cityVisible, setCityVisible] = useState(false);
    const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
    const [propertyVisible, setPropertyVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityToDelete, setCityToDelete] = useState(null);
    const [districtToDelete, setDistrictToDelete] = useState(null);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [cityDeleteSearch, setCityDeleteSearch] = useState('');
    const [districtDeleteSearch, setDistrictDeleteSearch] = useState('');
    const [typeDeleteSearch, setTypeDeleteSearch] = useState('');

    const cityTranslations = {
        'Киев': 'Київ',
        'Днепр': 'Дніпро',
        'Львов': 'Львів',
        'Луцк': 'Луцьк',
        'Винница': 'Вінниця',
        'Запорожье': 'Запоріжжя',
        'Житомир': 'Житомир',
        'Ивано-Франковск': 'Івано-Франківськ',
        'Маріуполь': 'Маріуполь',
        'Мариуполь': 'Маріуполь',
        'Кривой Рог': 'Кривий Ріг',
        'Николаев': 'Миколаїв',
        'Одесса': 'Одеса',
        'Харьков': 'Харків',
        'Севастополь': 'Севастополь'
    };

    const districtTranslations = {
        'Печерский': 'Печерський',
        'Подольский': 'Подільський',
        'Оболонский': 'Оболонський',
        'Приморский': 'Приморський',
        'Центральный Днепр': 'Центральний (Дніпро)',
        'Центральный Харьков': 'Центральний (Харків)',
        'Дарницький': 'Дарницький',
        'Деснянський': 'Деснянський',
        'Дніпровський': 'Дніпровський',
        'Голосіївський': 'Голосіївський',
        'Святошинський': 'Святошинський',
        'Шевченківський Київ': 'Шевченківський (Київ)',
        'Солом\'янський': 'Солом\'янський',
        'Малиновський': 'Малиновський',
        'Суворовський': 'Суворовський',
        'Київський Одеса': 'Київський (Одеса)',
        'Хаджибейський': 'Хаджибейський',
        'Амур-Нижньодніпровський': 'Амур-Нижньодніпровський',
        'Індустріальний Дніпро': 'Індустріальний (Дніпро)',
        'Красногвардійський': 'Красногвардійський',
        'Самарський': 'Самарський',
        'Київський Харків': 'Київський (Харків)',
        'Московський': 'Московський',
        'Жовтневий Харків': 'Жовтневий (Харків)',
        'Галицький': 'Галицький',
        'Залізничний': 'Залізничний',
        'Личаківський': 'Личаківський',
        'Сихівський': 'Сихівський',
        'Франківський': 'Франківський',
        'Індустріальний Запоріжжя': 'Індустріальний (Запоріжжя)',
        'Хортицький': 'Хортицький',
        'Заводський Запоріжжя': 'Заводський (Запоріжжя)',
        'Металургійний Кривий Ріг': 'Металургійний (Кривий Ріг)',
        'Довгинцівський': 'Довгинцівський',
        'Саксаганський': 'Саксаганський',
        'Центральний Миколаїв': 'Центральний (Миколаїв)',
        'Заводський Миколаїв': 'Заводський (Миколаїв)',
        'Корабельний': 'Корабельний',
        'Іллічівський': 'Іллічівський',
        'Приморський Маріуполь': 'Приморський (Маріуполь)',
        'Кальміуський': 'Кальміуський',
        'Староміський Вінниця': 'Староміський (Вінниця)',
        'Замостянський': 'Замостянський',
        'Ленінський Вінниця': 'Ленінський (Вінниця)',
        'Дніпровський Херсон': 'Дніпровський (Херсон)',
        'Суворовський Херсон': 'Суворовський (Херсон)',
        'Комсомольський Херсон': 'Комсомольський (Херсон)'
    };

    const typeTranslations = {
        'apartment': 'Квартира',
        'house': 'Будинок',
        'land': 'Ділянка',
        'office': 'Офіс',
        'commercial': 'Комерційна нерухомість',
        'Квартира': 'Квартира',
        'Дом': 'Будинок',
        'Участок': 'Ділянка',
        'Офис': 'Офіс',
        'Коммерческая': 'Комерційна',
        'Коммерческая недвижимость': 'Комерційна нерухомість'
    };

    const getCityName = (name = '') => cityTranslations[name] || name;
    const getDistrictName = (name = '') => districtTranslations[name] || name;
    const getTypeName = (name = '') => typeTranslations[name] || name;

    // Фильтрация недвижимости по поисковому запросу
    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.district && property.district.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        loadProperties();
        loadReferenceData();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await fetchProperties(null, null, null, null, 1, 1000); // Загружаем до 1000 объектов для админ-панели
            setProperties(data.rows || []);
        } catch (error) {
            console.error('Помилка завантаження нерухомості:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (property) => {
        setPropertyToEdit(property);
        setEditVisible(true);
    };

    const handleEditComplete = (updatedProperty) => {
        setProperties(properties.map(prop =>
            prop.id === updatedProperty.id ? updatedProperty : prop
        ));
        setEditVisible(false);
        setPropertyToEdit(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю нерухомість?')) {
            try {
                await deleteProperty(id);
                setProperties(properties.filter(property => property.id !== id));
            } catch (error) {
                alert('Помилка при видаленні: ' + error.message);
            }
        }
    };

    const handleSeedDatabase = async () => {
        if (window.confirm('Ви впевнені, що хочете наповнити базу даних тестовими даними? Це може зайняти деякий час.')) {
            setIsSeeding(true);
            try {
                await seedDatabase();
                alert('База даних успішно наповнена!');
            } catch (error) {
                alert('Помилка при наповненні бази даних: ' + error.message);
            } finally {
                setIsSeeding(false);
            }
        }
    };

    const loadReferenceData = async () => {
        try {
            const [types, cities, districts] = await Promise.all([
                fetchPropertyTypes(),
                fetchCities(),
                fetchDistricts()
            ]);
            property.setPropertyTypes(types);
            property.setCities(cities);
            property.setDistricts(districts);
            if (!typeToDelete && types[0]) setTypeToDelete(types[0].id);
            if (!cityToDelete && cities[0]) setCityToDelete(cities[0].id);
            if (!districtToDelete && districts[0]) setDistrictToDelete(districts[0].id);
        } catch (e) {
            console.error('Помилка завантаження довідників:', e);
        }
    };

    const handleDeleteType = async (id) => {
        if (!window.confirm('Видалити тип нерухомості?')) return;
        try {
            await deletePropertyType(id);
            property.setPropertyTypes(property.propertyTypes.filter(t => t.id !== id));
            setTypeToDelete(property.propertyTypes.filter(t => t.id !== id)[0]?.id || null);
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка видалення типу');
        }
    };

    const handleDeleteCity = async (id) => {
        if (!window.confirm('Видалити місто?')) return;
        try {
            await deleteCity(id);
            property.setCities(property.cities.filter(c => c.id !== id));
            setCityToDelete(property.cities.filter(c => c.id !== id)[0]?.id || null);
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка видалення міста');
        }
    };

    const handleDeleteDistrict = async (id) => {
        if (!window.confirm('Видалити район?')) return;
        try {
            await deleteDistrict(id);
            property.setDistricts(property.districts.filter(d => d.id !== id));
            setDistrictToDelete(property.districts.filter(d => d.id !== id)[0]?.id || null);
        } catch (e) {
            alert(e.response?.data?.message || 'Помилка видалення району');
        }
    };

    const filteredCitiesToDelete = useMemo(() => {
        return property.cities
            .map(c => ({...c, displayName: getCityName(c.name)}))
            .filter(c => c.displayName.toLowerCase().includes(cityDeleteSearch.toLowerCase()))
            .sort((a, b) => a.displayName.localeCompare(b.displayName, 'uk'));
    }, [property.cities, cityDeleteSearch]);

    const filteredDistrictsToDelete = useMemo(() => {
        return property.districts
            .map(d => ({...d, displayName: getDistrictName(d.name)}))
            .filter(d => d.displayName.toLowerCase().includes(districtDeleteSearch.toLowerCase()))
            .sort((a, b) => a.displayName.localeCompare(b.displayName, 'uk'));
    }, [property.districts, districtDeleteSearch]);

    const filteredTypesToDelete = useMemo(() => {
        return property.propertyTypes
            .map(t => ({...t, displayName: getTypeName(t.name)}))
            .filter(t => t.displayName.toLowerCase().includes(typeDeleteSearch.toLowerCase()))
            .sort((a, b) => a.displayName.localeCompare(b.displayName, 'uk'));
    }, [property.propertyTypes, typeDeleteSearch]);

    return (
        <Container className="d-flex flex-column">
            <h2 className="mt-4 mb-4">Адмін панель</h2>

            {/* Кнопки управления */}
            <div className="mb-4">
                <h4 className="mb-3">Управління даними</h4>
                <Row className="g-2 mt-2 mb-3">
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setPropertyTypeVisible(true)}
                        >
                            ➕ Тип нерухомості
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setCityVisible(true)}
                        >
                            ➕ Місто
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setDistrictVisible(true)}
                        >
                            ➕ Район
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-success"}
                            className="w-100"
                            onClick={handleSeedDatabase}
                            disabled={isSeeding}
                        >
                            {isSeeding ? '⏳ Наповнення...' : '🚀 Тестові дані'}
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3 gy-2">
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="h6 mb-3">Видалення міста</Card.Title>
                                <Form.Control
                                    type="text"
                                    placeholder="Пошук міста..."
                                    value={cityDeleteSearch}
                                    onChange={e => setCityDeleteSearch(e.target.value)}
                                    className="mb-2"
                                />
                                <div style={{maxHeight: 180, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: '4px 6px', marginBottom: '10px'}}>
                                    {filteredCitiesToDelete.length === 0 && (
                                        <div className="text-muted small px-1 py-2">Немає збігів</div>
                                    )}
                                    {filteredCitiesToDelete.map(c => (
                                        <div
                                            key={c.id}
                                            className={`d-flex justify-content-between align-items-center px-2 py-1 rounded ${cityToDelete === c.id ? 'bg-light' : ''}`}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => setCityToDelete(c.id)}
                                        >
                                            <span>{c.displayName}</span>
                                            {cityToDelete === c.id && <span className="text-success fw-bold">●</span>}
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    disabled={!cityToDelete}
                                    onClick={() => cityToDelete && handleDeleteCity(cityToDelete)}
                                >
                                    Видалити місто
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="h6 mb-3">Видалення району</Card.Title>
                                <Form.Control
                                    type="text"
                                    placeholder="Пошук району..."
                                    value={districtDeleteSearch}
                                    onChange={e => setDistrictDeleteSearch(e.target.value)}
                                    className="mb-2"
                                />
                                <div style={{maxHeight: 180, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: '4px 6px', marginBottom: '10px'}}>
                                    {filteredDistrictsToDelete.length === 0 && (
                                        <div className="text-muted small px-1 py-2">Немає збігів</div>
                                    )}
                                    {filteredDistrictsToDelete.map(d => (
                                        <div
                                            key={d.id}
                                            className={`d-flex justify-content-between align-items-center px-2 py-1 rounded ${districtToDelete === d.id ? 'bg-light' : ''}`}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => setDistrictToDelete(d.id)}
                                        >
                                            <span>{d.displayName}</span>
                                            {districtToDelete === d.id && <span className="text-success fw-bold">●</span>}
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    disabled={!districtToDelete}
                                    onClick={() => districtToDelete && handleDeleteDistrict(districtToDelete)}
                                >
                                    Видалити район
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="h6 mb-3">Видалення типу</Card.Title>
                                <Form.Control
                                    type="text"
                                    placeholder="Пошук типу..."
                                    value={typeDeleteSearch}
                                    onChange={e => setTypeDeleteSearch(e.target.value)}
                                    className="mb-2"
                                />
                                <div style={{maxHeight: 180, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: '4px 6px', marginBottom: '10px'}}>
                                    {filteredTypesToDelete.length === 0 && (
                                        <div className="text-muted small px-1 py-2">Немає збігів</div>
                                    )}
                                    {filteredTypesToDelete.map(t => (
                                        <div
                                            key={t.id}
                                            className={`d-flex justify-content-between align-items-center px-2 py-1 rounded ${typeToDelete === t.id ? 'bg-light' : ''}`}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => setTypeToDelete(t.id)}
                                        >
                                            <span>{t.displayName}</span>
                                            {typeToDelete === t.id && <span className="text-success fw-bold">●</span>}
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="danger"
                                    className="mt-2"
                                    disabled={!typeToDelete}
                                    onClick={() => typeToDelete && handleDeleteType(typeToDelete)}
                                >
                                    Видалити тип
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Список недвижимости для редактирования */}
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                        Управління нерухомістю ({filteredProperties.length}{searchQuery ? ` з ${properties.length}` : ''} об'єктів)
                    </h4>
                    {properties.length > 5 && (
                        <div style={{width: '300px'}}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Поиск недвижимости..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{borderRadius: '20px', padding: '8px 16px'}}
                            />
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="text-center mt-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                ) : properties.length > 0 ? (
                    <Row>
                        {filteredProperties.map(property => (
                            <PropertyItem
                                key={property.id}
                                property={property}
                                isAdmin={true}
                                onEdit={() => handleEdit(property)}
                                onDelete={() => handleDelete(property.id)}
                            />
                        ))}
                    </Row>
                ) : (
                    <div className="text-center mt-4 text-muted">
                        <p>🏠 Нерухомість поки відсутня</p>
                        <p>Додайте об'єкти через кнопку вище</p>
                    </div>
                )}
            </div>

            <CreateDistrict
                show={districtVisible}
                onHide={() => {
                    setDistrictVisible(false);
                    loadReferenceData();
                }}
            />
            <CreateCity
                show={cityVisible}
                onHide={() => {
                    setCityVisible(false);
                    loadReferenceData();
                }}
            />
            <CreateProperty
                show={propertyVisible}
                onHide={() => setPropertyVisible(false)}
                onCreate={() => {
                    loadProperties();
                    setPropertyVisible(false);
                    loadReferenceData();
                }}
            />
            <CreatePropertyType
                show={propertyTypeVisible}
                onHide={() => {
                    setPropertyTypeVisible(false);
                    loadReferenceData();
                }}
            />
            <EditProperty
                show={editVisible}
                onHide={() => {
                    setEditVisible(false);
                    setPropertyToEdit(null);
                }}
                propertyToEdit={propertyToEdit}
                onEdit={handleEditComplete}
            />
        </Container>
    );
});

export default Admin;