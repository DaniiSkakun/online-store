import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Dropdown, Form, Row, Col} from "react-bootstrap";
import {Context} from "../../index";
import {createProperty, fetchDistricts, fetchProperties, fetchPropertyTypes, fetchCities} from "../../http/propertyAPI";
import {observer} from "mobx-react-lite";

const CreateProperty = observer(({show, onHide}) => {
    const {property} = useContext(Context)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('Київ')
    const [area, setArea] = useState('')
    const [rooms, setRooms] = useState('')
    const [floor, setFloor] = useState('')
    const [totalFloors, setTotalFloors] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
    const [featureFlags, setFeatureFlags] = useState({})
    const [customFeatures, setCustomFeatures] = useState([])
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
        'Коммерческая недвижимость': 'Комерційна нерухомість',
        'Коммерческая': 'Комерційна нерухомість'
    };

    const cityTranslations = {
        'Киев': 'Київ',
        'Харьков': 'Харків',
        'Одесса': 'Одеса',
        'Днепр': 'Дніпро',
        'Днепропетровск': 'Дніпро',
        'Львов': 'Львів',
        'Луцк': 'Луцьк',
        'Винница': 'Вінниця',
        'Запорожье': 'Запоріжжя',
        'Житомир': 'Житомир',
        'Ивано-Франковск': 'Івано-Франківськ',
        'Маріуполь': 'Маріуполь',
        'Мариуполь': 'Маріуполь',
        'Кривой Рог': 'Кривий Ріг',
        'Николаев': 'Миколаїв'
    };

    const districtTranslations = {
        'Печерский': 'Печерський',
        'Шевченковский': 'Шевченківський',
        'Подольский': 'Подільський',
        'Дарницкий': 'Дарницький',
        'Оболонский': 'Оболонський',
        'Святошинский': 'Святошинський',
        'Голосеевский': 'Голосіївський',
        'Киевский': 'Київський',
        'Слободской': 'Слобідський',
        'Холодногорский': 'Холодногірський',
        'Приморский': 'Приморський',
        'Малиновский': 'Малиновський',
        'Суворовский': 'Суворовський',
        'Центральный': 'Центральний',
        'Чечеловский': 'Чечелівський',
        'Амур-Нижнеднепровский': 'Амур-Нижньодніпровський',
        'Индустриальный': 'Індустріальний',
        'Галицкий': 'Галицький',
        'Франковский': 'Франківський',
        'Лычаковский': 'Личаківський',
        'Заводский': 'Заводський',
        'Деснянский': 'Деснянський',
        'Днепровский': 'Дніпровський',
        'Днепровский Херсон': 'Дніпровський (Херсон)',
        'Довгинцевский': 'Довгинцівський',
        'Жовтневий Харків': 'Жовтневий (Харків)',
        'Заводський Запоріжжя': 'Заводський (Запоріжжя)'
    };

    const getPropertyTypeName = (name = '') => typeTranslations[name] || name;
    const getCityName = (name = '') => cityTranslations[name] || name;
    const getDistrictName = (name = '') => districtTranslations[name] || name;

    // Инициализация данных при открытии модального окна
    useEffect(() => {
        if (show) {
            console.log('Открытие модального окна CreateProperty')

            // Загружаем типы и районы, если они не загружены
            const loadData = async () => {
                let typesLoaded = false
                let districtsLoaded = false

                if (property.propertyTypes.length === 0) {
                    console.log('Загружаем типы недвижимости...')
                    try {
                        const data = await fetchPropertyTypes()
                        property.setPropertyTypes(data)
                        typesLoaded = true
                        console.log('Загружены типы:', data.length)
                    } catch (error) {
                        console.error('Помилка завантаження типів:', error)
                    }
                } else {
                    typesLoaded = true
                }

                if (property.districts.length === 0) {
                    console.log('Загружаем районы...')
                    try {
                        const data = await fetchDistricts()
                        property.setDistricts(data)
                        districtsLoaded = true
                        console.log('Загружены районы:', data.length)
                    } catch (error) {
                        console.error('Помилка завантаження районів:', error)
                    }
                } else {
                    districtsLoaded = true
                }

                if (property.cities.length === 0) {
                    console.log('Загружаем города...')
                    try {
                        const data = await fetchCities()
                        property.setCities(data)
                        console.log('Загружены города:', data.length)
                    } catch (error) {
                        console.error('Помилка завантаження міст:', error)
                    }
                }

                // Устанавливаем значения по умолчанию только после загрузки данных
                if (typesLoaded && property.propertyTypes.length > 0) {
                    console.log('Устанавливаем тип по умолчанию')
                    property.setSelectedPropertyType(property.propertyTypes[0])
                }
                if (districtsLoaded && property.districts.length > 0) {
                    console.log('Устанавливаем район по умолчанию')
                    property.setSelectedDistrict(property.districts[0])
                }

                if (property.cities.length > 0 && !property.selectedCity?.id) {
                    console.log('Устанавливаем город по умолчанию')
                    property.setSelectedCity(property.cities[0])
                }
            }

            loadData()
        }
    }, [show])

    // Отслеживаем загрузку данных и устанавливаем значения по умолчанию
    useEffect(() => {
        if (show && property.propertyTypes.length > 0 && !property.selectedPropertyType?.id) {
            console.log('🔄 Автоматически устанавливаем тип по умолчанию при загрузке данных')
            property.setSelectedPropertyType(property.propertyTypes[0])
        }
    }, [show, property.propertyTypes, property.selectedPropertyType])

    useEffect(() => {
        if (show && property.districts.length > 0 && !property.selectedDistrict?.id) {
            console.log('🔄 Автоматически устанавливаем район по умолчанию при загрузке данных')
            property.setSelectedDistrict(property.districts[0])
        }
    }, [show, property.districts, property.selectedDistrict])

    const filteredDistricts = property.selectedCity
        ? property.districts.filter(d => d.cityId === property.selectedCity.id)
        : property.districts
    const handleFeatureFlagChange = (key, value) => {
        setFeatureFlags(prev => ({...prev, [key]: value}))
    }

    const addFeature = () => {
        setCustomFeatures(prev => [...prev, {name: '', value: '', type: 'text', number: Date.now()}])
    }

    const removeFeature = (number) => {
        setCustomFeatures(prev => prev.filter(f => f.number !== number))
    }

    const changeFeature = (key, value, number) => {
        setCustomFeatures(prev => prev.map(f => f.number === number ? {...f, [key]: value} : f))
    }

    const handleWheel = (e) => {
        e.target.blur() // Убираем фокус, чтобы предотвратить изменение значения
    }

    const selectFiles = e => {
        const newFiles = Array.from(e.target.files)
        setFiles(prevFiles => [...prevFiles, ...newFiles])
    }

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove))
    }

    const addProperty = () => {
        // Проверяем, что все обязательные поля заполнены
        if (!title.trim()) {
            alert('Введіть назву нерухомості')
            return
        }
        if (!price || price <= 0) {
            alert('Ціна повинна бути більше 0')
            return
        }
        if (!address.trim()) {
            alert('Введіть адресу')
            return
        }
        if (!area || area <= 0) {
            alert('Введіть коректну площу')
            return
        }
        if (!rooms || rooms < 0) {
            alert('Кількість кімнат не може бути від\'ємною')
            return
        }
        if (!area || area <= 0) {
            alert('Площа повинна бути більше 0')
            return
        }
        if (!floor || floor < 0) {
            alert('Поверх не може бути від\'ємним')
            return
        }
        if (!totalFloors || totalFloors <= 0) {
            alert('Поверховість повинна бути більше 0')
            return
        }
        if (floor > totalFloors) {
            alert('Поверх не може бути більше загальної поверховості')
            return
        }
        if (!property.selectedCity?.id) {
            alert('Оберіть місто')
            return
        }
        if (!property.selectedPropertyType?.id) {
            alert('Оберіть тип нерухомості')
            return
        }
        if (!property.selectedDistrict?.id) {
            alert('Оберіть район')
            return
        }

        const formData = new FormData()
        const propertyTypeValue = property.selectedPropertyType?.slug || property.selectedPropertyType?.name || 'apartment'
        formData.append('title', title)
        formData.append('price', price)
        formData.append('address', address)
        formData.append('city', city)
        formData.append('area', area)
        formData.append('rooms', rooms)
        formData.append('floor', floor)
        formData.append('total_floors', totalFloors)
        formData.append('property_type', propertyTypeValue)
        formData.append('description', description)
        formData.append('propertyTypeId', property.selectedPropertyType.id)
        formData.append('districtId', property.selectedDistrict.id)
        formData.append('cityId', property.selectedCity.id)

        // Добавляем изображения
        files.forEach(file => {
            formData.append('images', file)
        })

        // Добавляем характеристики
        const knownKeys = ['balcony', 'parking', 'elevator', 'air_conditioning', 'furniture', 'internet']
        const featureList = []
        knownKeys.forEach(key => {
            if (featureFlags[key]) {
                featureList.push({name: key, value: 'true', type: 'boolean'})
            }
        })
        customFeatures.forEach(f => {
            if (f.name) {
                featureList.push({
                    name: f.name,
                    value: f.value || '',
                    type: f.type || 'text'
                })
            }
        })
        formData.append('features', JSON.stringify(featureList))

        createProperty(formData).then(data => {
            // Очистка выбранных значений в store
            property.clearSelectedPropertyType()
            property.clearSelectedDistrict()
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header closeButton closeVariant="dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати нерухомість
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Основная информация */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">📝 Основна інформація</h6>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Control
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Назва оголошення"
                                    className="mb-2"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Control
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="Ціна (грн)"
                                    type="number"
                                    min="0"
                                    onWheel={handleWheel}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* Локація */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">📍 Локація</h6>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Control
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Вулиця, будинок, квартира"
                                    className="mb-2"
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={3}>
                                <Dropdown className="mt-3">
                                    <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                        {getCityName(property.selectedCity?.name) || "Оберіть місто"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {property.cities && property.cities.length > 0 ? (
                                            property.cities.map(city => (
                                                <Dropdown.Item
                                                    onClick={() => {
                                                        console.log('Выбран город:', city.name)
                                                        property.setSelectedCity(city)
                                                        // автоматически ставим первый район выбранного города
                                                        const firstDistrict = property.districts.find(d => d.cityId === city.id)
                                                        if (firstDistrict) {
                                                            property.setSelectedDistrict(firstDistrict)
                                                        } else {
                                                            property.setSelectedDistrict(null)
                                                        }
                                                        console.log('Текущий selectedCity:', property.selectedCity)
                                                    }}
                                                    key={city.id}
                                                >
                                                    {getCityName(city.name)}
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item disabled>
                                                Завантаження міст...
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col md={3}>
                                <Dropdown className="mt-3">
                                    <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                        {getPropertyTypeName(property.selectedPropertyType?.name) || "Тип нерухомості"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {property.propertyTypes && property.propertyTypes.length > 0 ? (
                                            property.propertyTypes.map(propertyType =>
                                                <Dropdown.Item
                                                    onClick={() => {
                                                    console.log('Выбран тип:', propertyType.name)
                                                        property.setSelectedPropertyType(propertyType)
                                                        console.log('Текущий selectedPropertyType:', property.selectedPropertyType)
                                                    }}
                                                    key={propertyType.id}
                                                >
                                                    {getPropertyTypeName(propertyType.name)}
                                                </Dropdown.Item>
                                            )
                                        ) : (
                                            <Dropdown.Item disabled>
                                                Завантаження типів...
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col md={6}>
                                <Dropdown className="mt-3">
                                    <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                        {getDistrictName(property.selectedDistrict?.name) || "Район"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {filteredDistricts && filteredDistricts.length > 0 ? (
                                            filteredDistricts.map(district =>
                                                <Dropdown.Item
                                                    onClick={() => {
                                                        console.log('Выбран район:', district.name)
                                                        property.setSelectedDistrict(district)
                                                        console.log('Текущий selectedDistrict:', property.selectedDistrict)
                                                    }}
                                                    key={district.id}
                                                >
                                                    {getDistrictName(district.name)}
                                                </Dropdown.Item>
                                            )
                                        ) : (
                                            <Dropdown.Item disabled>
                                                {property.selectedCity ? 'Немає районів для цього міста' : 'Завантаження районів...'}
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </div>

                    {/* Характеристики */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">🏠 Характеристики</h6>
                        <Row>
                            <Col md={3}>
                                <Form.Control
                                    value={area}
                                    onChange={e => setArea(e.target.value)}
                                    placeholder="м²"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    onWheel={handleWheel}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    value={rooms}
                                    onChange={e => setRooms(e.target.value)}
                                    placeholder="Кімнат"
                                    type="number"
                                    min="0"
                                    onWheel={handleWheel}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    value={floor}
                                    onChange={e => setFloor(e.target.value)}
                                    placeholder="Поверх"
                                    type="number"
                                    min="0"
                                    onWheel={handleWheel}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    value={totalFloors}
                                    onChange={e => setTotalFloors(e.target.value)}
                                    placeholder="Поверхів"
                                    type="number"
                                    min="0"
                                    onWheel={handleWheel}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* Опис */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">📄 Опис</h6>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Детальний опис нерухомості..."
                        />
                    </div>

                    {/* Дополнительные характеристики */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">★ Додаткові характеристики</h6>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Балкон"
                                    checked={featureFlags.balcony === true}
                                    onChange={e => handleFeatureFlagChange('balcony', e.target.checked)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Парковка"
                                    checked={featureFlags.parking === true}
                                    onChange={e => handleFeatureFlagChange('parking', e.target.checked)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Ліфт"
                                    checked={featureFlags.elevator === true}
                                    onChange={e => handleFeatureFlagChange('elevator', e.target.checked)}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Кондиціонер"
                                    checked={featureFlags.air_conditioning === true}
                                    onChange={e => handleFeatureFlagChange('air_conditioning', e.target.checked)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Меблі"
                                    checked={featureFlags.furniture === true}
                                    onChange={e => handleFeatureFlagChange('furniture', e.target.checked)}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Інтернет"
                                    checked={featureFlags.internet === true}
                                    onChange={e => handleFeatureFlagChange('internet', e.target.checked)}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* Загрузка изображений */}
                    <div className="mb-4">
                        <h6 className="text-primary mb-3">📸 Зображення</h6>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={selectFiles}
                            accept="image/*"
                        />
                        {files.length > 0 && (
                            <div className="mt-2">
                                <div className="text-muted mb-2">
                                    Вибрано файлів: {files.length}
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {Array.from(files).map((file, index) => (
                                        <div key={index} className="position-relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Превью ${index + 1}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #dee2e6'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute"
                                                style={{
                                                    top: '-5px',
                                                    right: '-5px',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    padding: '0',
                                                    fontSize: '12px',
                                                    lineHeight: '1'
                                                }}
                                                onClick={() => removeFile(index)}
                                                title="Видалити зображення"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                    <hr/>
                    <Button
                        variant="dark"
                        onClick={addFeature}
                    >
                        Додати характеристику
                    </Button>

                    {customFeatures.map(i =>
                        <Row className="mt-3" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.name}
                                    onChange={(e) => changeFeature('name', e.target.value, i.number)}
                                    placeholder="Назва характеристики"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.value}
                                    onChange={(e) => changeFeature('value', e.target.value, i.number)}
                                    placeholder="Значення"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Select
                                    value={i.type}
                                    onChange={(e) => changeFeature('type', e.target.value, i.number)}
                                >
                                    <option value="boolean">Так/Ні</option>
                                    <option value="text">Текст</option>
                                    <option value="number">Число</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Button
                                    onClick={() => removeFeature(i.number)}
                                    variant="danger"
                                    size="sm"
                                >
                                    ✕
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Закрити</Button>
                <Button variant="success" onClick={addProperty}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProperty;


