import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Dropdown, Form, Row, Col} from "react-bootstrap";
import {Context} from "../../index";
import {updateProperty, fetchDistricts, fetchPropertyTypes, fetchCities} from "../../http/propertyAPI";
import {observer} from "mobx-react-lite";

const EditProperty = observer(({show, onHide, propertyToEdit, onEdit}) => {
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
    const [existingImages, setExistingImages] = useState([])
    const [featureFlags, setFeatureFlags] = useState({})
    const [customFeatures, setCustomFeatures] = useState([])

    // Инициализация данных при открытии модального окна
    useEffect(() => {
        if (show && propertyToEdit) {
            console.log('🎯 Инициализация редактирования:', propertyToEdit.title)

            // Загружаем типы и районы, если они не загружены
            const loadData = async () => {
                if (property.propertyTypes.length === 0) {
                    console.log('Загружаем типы недвижимости...')
                    try {
                        const data = await fetchPropertyTypes()
                        property.setPropertyTypes(data)
                        console.log('Загружены типы:', data.length)
                    } catch (error) {
                        console.error('Помилка завантаження типів:', error)
                    }
                }

                if (property.districts.length === 0) {
                    console.log('Загружаем районы...')
                    try {
                        const data = await fetchDistricts()
                        property.setDistricts(data)
                        console.log('Загружены районы:', data.length)
                    } catch (error) {
                        console.error('Помилка завантаження районів:', error)
                    }
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

                // Заполняем форму данными существующего объявления
                setTitle(propertyToEdit.title || '')
                setPrice(propertyToEdit.price || '')
                setAddress(propertyToEdit.address || '')
                setCity(propertyToEdit.city || 'Київ')
                setArea(propertyToEdit.area || '')
                setRooms(propertyToEdit.rooms || '')
                setFloor(propertyToEdit.floor || '')
                setTotalFloors(propertyToEdit.total_floors || '')
                setPropertyType(propertyToEdit.property_type || '')
                setDescription(propertyToEdit.description || '')
                // Нормализуем существующие изображения в массив
                const normalizeImages = (imgs) => {
                    if (!imgs) return []
                    if (Array.isArray(imgs)) return imgs
                    // если пришла строка JSON или одиночная строка пути
                    if (typeof imgs === 'string') {
                        try {
                            const parsed = JSON.parse(imgs)
                            if (Array.isArray(parsed)) return parsed
                        } catch (e) {
                            // не JSON, считаем одиночным путём
                            return [imgs]
                        }
                        return [imgs]
                    }
                    return []
                }

                setExistingImages(normalizeImages(propertyToEdit.images))

                // Устанавливаем выбранные значения в store
                const typeIdFromEdit = propertyToEdit.propertyTypeId || propertyToEdit.type?.id
                const propertyTypeObj =
                    (typeIdFromEdit && property.propertyTypes.find(type => type.id === typeIdFromEdit))
                    || property.propertyTypes.find(type => type.name === propertyToEdit.property_type)
                if (propertyTypeObj) property.setSelectedPropertyType(propertyTypeObj)

                const districtObj = property.districts.find(district => district.name === propertyToEdit.district?.name)
                if (districtObj) {
                    property.setSelectedDistrict(districtObj)
                }

                // Находим город по названию города в объявлении
                const cityObj = property.cities.find(city => city.name === propertyToEdit.city)
                if (cityObj) {
                    property.setSelectedCity(cityObj)
                }

                // Загружаем характеристики
                if (propertyToEdit.features) {
                    const knownKeys = ['balcony', 'parking', 'elevator', 'air_conditioning', 'furniture', 'internet']
                    const flags = {}
                    const customs = []
                    propertyToEdit.features.forEach(feature => {
                        const name = feature.feature_name || feature.feature_type
                        const value = feature.feature_value
                        if (knownKeys.includes(name)) {
                            flags[name] = value === 'true' || value === true
                        } else {
                            customs.push({
                                name: feature.feature_name || '',
                                value: feature.feature_value || '',
                                type: feature.feature_type || 'text',
                                number: Date.now() + Math.random()
                            })
                        }
                    })
                    setFeatureFlags(flags)
                    setCustomFeatures(customs)
                } else {
                    setFeatureFlags({})
                    setCustomFeatures([])
                }
            }

            loadData()
        }
    }, [show, propertyToEdit])

    // Функция для получения типа недвижимости на русском
    const getPropertyTypeName = (type) => {
        const types = {
            // англійські коди
            'apartment': 'Квартира',
            'house': 'Будинок',
            'land': 'Ділянка',
            'office': 'Офіс',
            'commercial': 'Комерційна нерухомість',
            // можливі російські значення з БД
            'Квартира': 'Квартира',
            'Дом': 'Будинок',
            'Участок': 'Ділянка',
            'Офис': 'Офіс',
            'Коммерческая недвижимость': 'Комерційна нерухомість'
        }
        return types[type] || type
    }

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

    const getCityName = (name = '') => cityTranslations[name] || name;
    const getDistrictName = (name = '') => districtTranslations[name] || name;

    const selectFiles = (e) => {
        const newFiles = Array.from(e.target.files)
        setFiles([...files, ...newFiles])
    }

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove))
    }

    const removeExistingImage = (imageName) => {
        setExistingImages(existingImages.filter(img => img !== imageName))
    }

    const editProperty = () => {
        // Проверяем, что все обязательные поля заполнены
        if (!title.trim()) {
            alert('Введіть назву нерухомості')
            return
        }
        if (!price || price <= 0) {
            alert('Введіть коректну ціну')
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
        // Кол-во комнат теперь не обязательно, но если задано — должно быть >0
        if (rooms && rooms <= 0) {
            alert('Введіть коректну кількість кімнат')
            return
        }
        const effectiveTypeId = property.selectedPropertyType?.id || propertyToEdit?.propertyTypeId || propertyToEdit?.type?.id
        if (!effectiveTypeId) {
            alert('Оберіть тип нерухомості')
            return
        }
        const effectiveCityId = property.selectedCity?.id || propertyToEdit?.cityId || propertyToEdit?.city?.id
        if (!effectiveCityId) {
            alert('Оберіть місто')
            return
        }
        const effectiveDistrictId = property.selectedDistrict?.id || propertyToEdit?.districtId || propertyToEdit?.district?.id
        if (!effectiveDistrictId) {
            alert('Оберіть район')
            return
        }

        const formData = new FormData()
        const propertyTypeValue =
            property.selectedPropertyType?.slug
            || property.selectedPropertyType?.name
            || propertyType
            || propertyToEdit?.property_type
            || 'apartment'
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
        formData.append('propertyTypeId', effectiveTypeId)
        formData.append('districtId', effectiveDistrictId)
        formData.append('cityId', effectiveCityId)

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

        // Добавляем существующие изображения (которых не удалили)
        formData.append('existingImages', JSON.stringify(Array.isArray(existingImages) ? existingImages : []))

        // Добавляем новые изображения
        files.forEach(file => {
            formData.append('images', file)
        })

        updateProperty(propertyToEdit.id, formData).then(data => {
            console.log('✅ Объявление обновлено:', data)
            // Очистка выбранных значений в store
            property.clearSelectedPropertyType()
            property.clearSelectedDistrict()
            onEdit(data) // Передаем обновленные данные родительскому компоненту
            onHide()
        }).catch(error => {
            console.error('❌ Помилка оновлення:', error)
            alert('Помилка при оновленні оголошення')
        })
    }

    const handleFeatureChange = (featureType, value) => {
        setFeatureFlags(prev => ({
            ...prev,
            [featureType]: value
        }))
    }

    const addCustomFeature = () => {
        setCustomFeatures(prev => [...prev, {name: '', value: '', type: 'text', number: Date.now() + Math.random()}])
    }

    const changeCustomFeature = (field, value, number) => {
        setCustomFeatures(prev => prev.map(f => f.number === number ? {...f, [field]: value} : f))
    }

    const removeCustomFeature = (number) => {
        setCustomFeatures(prev => prev.filter(f => f.number !== number))
    }

    // Подписи для выпадающих списков с учетом уже выбранных значений
    const cityLabel = getCityName(property.selectedCity?.name || city) || "Оберіть місто"
    const districtLabel = getDistrictName(property.selectedDistrict?.name || propertyToEdit?.district?.name) || "Оберіть район"
    const propertyTypeLabel = getPropertyTypeName(property.selectedPropertyType?.name || propertyType) || "Оберіть тип нерухомості"

    // Фильтр районов по выбранному городу
    const filteredDistricts = property.selectedCity
        ? property.districts.filter(d => d.cityId === property.selectedCity.id)
        : property.districts

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header closeButton closeVariant="dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    ✏️ Редагувати оголошення
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Control
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Назва оголошення"
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="Ціна"
                                type="number"
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Control
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Адреса"
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="Місто"
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Control
                                value={area}
                                onChange={e => setArea(e.target.value)}
                                placeholder="Площа, м²"
                                type="number"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                value={rooms}
                                onChange={e => setRooms(e.target.value)}
                                placeholder="Кімнат"
                                type="number"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                value={floor}
                                onChange={e => setFloor(e.target.value)}
                                placeholder="Поверх"
                                type="number"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                value={totalFloors}
                                onChange={e => setTotalFloors(e.target.value)}
                                placeholder="Усього поверхів"
                                type="number"
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3 g-2">
                        <Col md={4}>
                            <Dropdown className="mt-3">
                                <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                    {cityLabel}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {property.cities && property.cities.length > 0 ? (
                                        property.cities.map(city => (
                                            <Dropdown.Item
                                                onClick={() => {
                                                    property.setSelectedCity && property.setSelectedCity(city)
                                                    property.setSelectedDistrict && property.setSelectedDistrict(null)
                                                    setCity(city.name)
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
                        <Col md={4}>
                            <Dropdown className="mt-3">
                                <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                    {propertyTypeLabel}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {property.propertyTypes && property.propertyTypes.length > 0 ? (
                                        property.propertyTypes.map(propertyType => (
                                            <Dropdown.Item
                                                onClick={() => {
                                                    property.setSelectedPropertyType(propertyType)
                                                    setPropertyType(propertyType.name)
                                                }}
                                                key={propertyType.id}
                                            >
                                                {getPropertyTypeName(propertyType.name)}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item disabled>
                                            Завантаження типів...
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={4}>
                            <Dropdown className="mt-3">
                                <Dropdown.Toggle className="w-100 text-start" variant="outline-secondary" style={{minHeight: '38px'}}>
                                    {districtLabel}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {filteredDistricts && filteredDistricts.length > 0 ? (
                                        filteredDistricts.map(district => (
                                            <Dropdown.Item
                                                onClick={() => property.setSelectedDistrict(district)}
                                                key={district.id}
                                            >
                                                {getDistrictName(district.name)}
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item disabled>
                                            {property.selectedCity ? 'Немає районів для цього міста' : 'Завантаження районів...'}
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>

                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Опис"
                        className="mb-3"
                    />

                    {/* Характеристики */}
                    <h6 className="mb-3">Характеристики:</h6>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Балкон"
                                checked={featureFlags.balcony === true}
                                onChange={e => handleFeatureChange('balcony', e.target.checked)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Парковка"
                                checked={featureFlags.parking === true}
                                onChange={e => handleFeatureChange('parking', e.target.checked)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Ліфт"
                                checked={featureFlags.elevator === true}
                                onChange={e => handleFeatureChange('elevator', e.target.checked)}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Кондиціонер"
                                checked={featureFlags.air_conditioning === true}
                                onChange={e => handleFeatureChange('air_conditioning', e.target.checked)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Меблі"
                                checked={featureFlags.furniture === true}
                                onChange={e => handleFeatureChange('furniture', e.target.checked)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Check
                                type="checkbox"
                                label="Інтернет"
                                checked={featureFlags.internet === true}
                                onChange={e => handleFeatureChange('internet', e.target.checked)}
                            />
                        </Col>
                    </Row>

                    <hr/>
                    <Button variant="dark" onClick={addCustomFeature}>Додати характеристику</Button>

                    {customFeatures.map(feature => (
                        <Row className="mt-3" key={feature.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={feature.name}
                                    onChange={e => changeCustomFeature('name', e.target.value, feature.number)}
                                    placeholder="Назва характеристики"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={feature.value}
                                    onChange={e => changeCustomFeature('value', e.target.value, feature.number)}
                                    placeholder="Значення"
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Select
                                    value={feature.type}
                                    onChange={e => changeCustomFeature('type', e.target.value, feature.number)}
                                >
                                    <option value="boolean">Так/Ні</option>
                                    <option value="text">Текст</option>
                                    <option value="number">Число</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Button variant="danger" size="sm" onClick={() => removeCustomFeature(feature.number)}>✕</Button>
                            </Col>
                        </Row>
                    ))}

                    {/* Управление изображениями */}
                    <div className="mt-4">
                        <h6 className="text-primary mb-3">📸 Зображення</h6>

                        {/* Существующие изображения */}
                        {Array.isArray(existingImages) && existingImages.length > 0 && (
                            <div className="mb-3">
                                <h6 className="text-secondary mb-2">Поточні зображення:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="position-relative">
                                            <img
                                                src={process.env.REACT_APP_API_URL + image}
                                                    alt={`Зображення ${index + 1}`}
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
                                                onClick={() => removeExistingImage(image)}
                                                title="Видалити зображення"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Добавление новых изображений */}
                        <div>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={selectFiles}
                                accept="image/*"
                                className="mb-2"
                            />
                            {files.length > 0 && (
                                <div className="mt-2">
                                    <div className="text-muted mb-2">
                                        Нові зображення: {files.length}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {Array.from(files).map((file, index) => (
                                            <div key={index} className="position-relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Нове зображення ${index + 1}`}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid #28a745'
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
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Скасувати
                </Button>
                <Button variant="success" onClick={editProperty}>
                    💾 Зберегти зміни
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default EditProperty;
