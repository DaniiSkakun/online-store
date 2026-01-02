import React, {useEffect, useState, useContext} from 'react';
import {Button, Card, Col, Container, Image, Row, Carousel, Modal, Form, Alert} from "react-bootstrap";
import {useParams, useHistory} from 'react-router-dom'
import {fetchOneProperty, contactSeller} from "../http/propertyAPI";
import {Context} from "../index";
import {addToFavorite, removeFromFavorite, getUserFavorites} from '../http/favoriteAPI';
import {observer} from "mobx-react-lite";

const PropertyPage = observer(() => {
    const { user, property: propertyStore } = useContext(Context);
    const history = useHistory();
    const [property, setProperty] = useState({features: []})
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [modalImageIndex, setModalImageIndex] = useState(0)
    const [contactVisible, setContactVisible] = useState(false)
    const [contactName, setContactName] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [contactMessage, setContactMessage] = useState('')
    const [contactSending, setContactSending] = useState(false)
    const [contactError, setContactError] = useState('')
    const [contactSuccess, setContactSuccess] = useState('')
    const {id} = useParams()

    useEffect(() => {
        fetchOneProperty(id).then(data => {
            setProperty(data)
            // Заполним контактные данные пользователя (если авторизован)
            if (user?.user?.email) {
                setContactEmail(user.user.email)
            }
            if (user?.user?.name) {
                setContactName(user.user.name)
            }
        })
    }, [])

    // Обработчик клавиш для модального окна
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (!showModal) return

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault()
                    prevModalImage()
                    break
                case 'ArrowRight':
                    event.preventDefault()
                    nextModalImage()
                    break
                case 'Escape':
                    event.preventDefault()
                    closeModal()
                    break
                default:
                    break
            }
        }

        if (showModal) {
            document.addEventListener('keydown', handleKeyPress)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [showModal, modalImageIndex])

    // Проверка и коррекция индексов изображений
    useEffect(() => {
        if (property.images && property.images.length > 0) {
            if (currentImageIndex >= property.images.length) {
                setCurrentImageIndex(0)
            }
            if (modalImageIndex >= property.images.length) {
                setModalImageIndex(0)
            }
        } else {
            setCurrentImageIndex(0)
            setModalImageIndex(0)
        }
    }, [property.images, currentImageIndex, modalImageIndex])

    // Функция для форматирования цены
    const formatPrice = (price) => {
        return new Intl.NumberFormat('uk-UA').format(price) + ' ₴'
    }

    // Функция для получения типа недвижимости на украинском
    const getPropertyTypeName = (type) => {
        const types = {
            // коди
            'apartment': 'Квартира',
            'house': 'Будинок',
            'land': 'Ділянка',
            'office': 'Офіс',
            'commercial': 'Комерційна нерухомість',
            // можливі російські/українські значення
            'Квартира': 'Квартира',
            'Дом': 'Будинок',
            'Будинок': 'Будинок',
            'Коттедж': 'Будинок',
            'Участок': 'Ділянка',
            'Ділянка': 'Ділянка',
            'Офис': 'Офіс',
            'Коммерческая': 'Комерційна нерухомість',
            'Коммерческая недвижимость': 'Комерційна нерухомість',
            'Комерційна нерухомість': 'Комерційна нерухомість'
        }
        return types[type] || type
    }

    const cityTranslations = {
        'Киев': 'Київ',
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
        'Николаев': 'Миколаїв',
        'Одесса': 'Одеса',
        'Харьков': 'Харків'
    };

    const getCityName = (name = '') => cityTranslations[name] || name;

    // Функции для управления галереей изображений
    const nextImage = () => {
        if (!property.images || property.images.length === 0) return
        setCurrentImageIndex((prev) =>
            prev === property.images.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = () => {
        if (!property.images || property.images.length === 0) return
        setCurrentImageIndex((prev) =>
            prev === 0 ? property.images.length - 1 : prev - 1
        )
    }

    const selectImage = (index) => {
        if (!property.images || property.images.length === 0) return
        setCurrentImageIndex(index)
    }

    const openModal = (index) => {
        if (!property.images || property.images.length === 0) return
        setModalImageIndex(index)
        setShowModal(true)
    }

    const closeModal = () => setShowModal(false)

    const nextModalImage = () => {
        if (!property.images || property.images.length === 0) return
        setModalImageIndex((prev) =>
            prev === property.images.length - 1 ? 0 : prev + 1
        )
    }

    const prevModalImage = () => {
        if (!property.images || property.images.length === 0) return
        setModalImageIndex((prev) =>
            prev === 0 ? property.images.length - 1 : prev - 1
        )
    }

    // Обработчик добавления/удаления из избранного
    const handleFavoriteToggle = async () => {
        if (!user.isAuth) {
            alert('Для додавання в обране потрібно увійти в систему');
            history.push('/login');
            return;
        }

        try {
            if (propertyStore.isInFavorites(property.id)) {
                // Удаляем из избранного
                await removeFromFavorite(property.id);
                propertyStore.removeFromFavorites(property.id);
                console.log('✅ Товар видалено з обраного');
            } else {
                // Добавляем в избранное
                await addToFavorite(property.id);
                propertyStore.addToFavoritesLocally(property);
                console.log('✅ Товар додано в обране');
            }

            // Синхронизируем с сервером в фоне (без блокировки UI)
            setTimeout(async () => {
                try {
                    const favorites = await getUserFavorites();
                    propertyStore.setFavorites(favorites);
                } catch (syncError) {
                    console.warn('Помилка синхронізації з сервером:', syncError);
                }
            }, 100);

        } catch (error) {
            console.error('Помилка роботи з обраним:', error);
            alert('Помилка при роботі з обраним');

            // В случае ошибки восстанавливаем актуальное состояние
            try {
                const favorites = await getUserFavorites();
                propertyStore.setFavorites(favorites);
            } catch (rollbackError) {
                console.error('Помилка відновлення стану:', rollbackError);
            }
        }
    }

    const submitContact = async () => {
        setContactError('')
        setContactSuccess('')
        if (!contactMessage.trim()) {
            setContactError('Введіть повідомлення')
            return
        }
        if (!contactEmail.trim()) {
            setContactError('Вкажіть email для відповіді')
            return
        }
        setContactSending(true)
        try {
            await contactSeller(property.id, {
                name: contactName,
                email: contactEmail,
                message: contactMessage
            })
            setContactSuccess('Повідомлення відправлено продавцю')
            setContactMessage('')
        } catch (error) {
            setContactError(error.response?.data?.message || 'Не вдалося надіслати повідомлення')
        } finally {
            setContactSending(false)
        }
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col md={6}>
                    {property.images && property.images.length > 0 ? (
                        <div className="image-gallery">
                            {/* Основное изображение */}
                            <div className="main-image-container" style={{position: 'relative', marginBottom: '15px'}}>
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={process.env.REACT_APP_API_URL + property.images[currentImageIndex]}
                                        alt={`Зображення ${currentImageIndex + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '400px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onClick={() => openModal(currentImageIndex)}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        fluid
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '400px',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8f9fa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#6c757d',
                                            fontSize: '18px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        📷 Немає зображень
                                    </div>
                                )}

                                {/* Лічильник зображень */}
                                {property.images && property.images.length > 0 && (
                                    <div
                                        className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded"
                                        style={{
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {currentImageIndex + 1} / {property.images.length}
                                    </div>
                                )}
                            </div>

                            {/* Миниатюры */}
                            {property.images && property.images.length > 1 && (
                                <div className="thumbnails-container d-flex gap-2 overflow-auto pb-2">
                                    {property.images.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => selectImage(index)}
                                            style={{
                                                minWidth: '80px',
                                                height: '60px',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent',
                                                transition: 'all 0.2s ease',
                                                opacity: index === currentImageIndex ? 1 : 0.7
                                            }}
                                            onMouseEnter={(e) => {
                                                if (index !== currentImageIndex) {
                                                    e.target.style.opacity = '0.9'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (index !== currentImageIndex) {
                                                    e.target.style.opacity = '0.7'
                                                }
                                            }}
                                        >
                                            <Image
                                                src={process.env.REACT_APP_API_URL + image}
                                                alt={`Мініатюра ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '400px',
                                borderRadius: '8px',
                                backgroundColor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6c757d',
                                fontSize: '18px',
                                fontWeight: '500'
                            }}
                        >
                                        📷 Немає зображень
                        </div>
                    )}
                </Col>
                <Col md={6}>
                    <Row className="d-flex flex-column">
                        <h2 className="mb-3">{property.title}</h2>

                        <div className="mb-3">
                            <div className="text-muted">{getPropertyTypeName(property.property_type)}</div>
                            <div>{getCityName(property.city)}, {property.address}</div>
                        </div>

                        {/* Кнопки действий - отдельный блок сверху */}
                        <div className="d-flex gap-5 mb-4">
                            <Button
                                variant={propertyStore.isInFavorites(property.id) ? "danger" : "outline-secondary"}
                                size="lg"
                                onClick={handleFavoriteToggle}
                                style={{flex: 1, marginRight: '20px', fontSize: '1.4rem', fontWeight: 700}}
                            >
                                {propertyStore.isInFavorites(property.id) ? '★ В обраному' : '☆ Додати в обране'}
                            </Button>
                            <Button
                                variant={"primary"}
                                size="lg"
                                style={{flex: 1, marginLeft: '20px'}}
                                onClick={() => {
                                    setContactVisible(true)
                                    setContactSuccess('')
                                    setContactError('')
                                }}
                            >
                                Зв'язатися з продавцем
                            </Button>
                        </div>

                        {/* Карточка с ценой */}
                        <Card className="p-4 mb-4">
                            <div>
                                <h3 className="text-success mb-2">{formatPrice(property.price)}</h3>
                                <small className="text-muted">
                                    {property.area ? `${property.area} м²` : ''}
                                    {property.area && property.price ? ` • ${Math.round(property.price / property.area)} ₴/м²` : ''}
                                </small>
                            </div>
                        </Card>

                        <div className="row g-3">
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <div className="text-muted small">Кімнат</div>
                                    <div className="fw-bold">{property.rooms || '—'}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <div className="text-muted small">Поверх</div>
                                    <div className="fw-bold">
                                        {property.floor && property.total_floors
                                            ? `${property.floor}/${property.total_floors}`
                                            : property.floor || '—'
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <div className="text-muted small">Площа</div>
                                    <div className="fw-bold">{property.area ? `${property.area} м²` : '—'}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <div className="text-muted small">Рік будівництва</div>
                                    <div className="fw-bold">—</div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Col>
            </Row>

            {property.description && (
                <Row className="mt-4">
                    <Col>
                        <Card className="p-4">
                            <h4 className="mb-3">Опис</h4>
                            <p className="mb-0">{property.description}</p>
                        </Card>
                    </Col>
                </Row>
            )}

            {property.features && property.features.length > 0 && (
                <Row className="mt-4">
                    <Col>
                        <Card className="p-4">
                            <h4 className="mb-3">Характеристики</h4>
                            <Row>
                                {property.features.map((feature, index) => (
                                    <Col md={6} key={feature.id} className="mb-3">
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">{feature.feature_name}:</span>
                                            <span className="fw-bold">
                                                {feature.feature_type === 'boolean'
                                                    ? (feature.feature_value === 'true' ? 'Так' : 'Ні')
                                                    : feature.feature_value
                                                }
                                            </span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Модальное окно для просмотра изображений */}
            <Modal
                show={showModal}
                onHide={closeModal}
                centered
                size="xl"
                style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
            >
                <Modal.Body style={{padding: '0', backgroundColor: 'black'}}>
                    <div style={{position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {/* Левая кнопка навигации */}
                        {property.images && property.images.length > 1 && (
                            <Button
                                variant="light"
                                size="sm"
                                onClick={prevModalImage}
                                style={{
                                    position: 'absolute',
                                    left: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                    zIndex: 5
                                }}
                            >
                                ‹
                            </Button>
                        )}

                        {property.images && property.images.length > 0 ? (
                            <Image
                                src={process.env.REACT_APP_API_URL + property.images[modalImageIndex]}
                                alt={`Зображення ${modalImageIndex + 1}`}
                                style={{
                                    maxWidth: '80vw',
                                    maxHeight: '80vh',
                                    objectFit: 'contain'
                                }}
                                fluid
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '18px',
                                    fontWeight: '500'
                                }}
                            >
                                📷 Немає зображень для перегляду
                            </div>
                        )}

                        {/* Правая кнопка навигации */}
                        {property.images && property.images.length > 1 && (
                            <Button
                                variant="light"
                                size="sm"
                                onClick={nextModalImage}
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                    zIndex: 5
                                }}
                            >
                                ›
                            </Button>
                        )}

                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={contactVisible} onHide={() => setContactVisible(false)} centered>
                <Modal.Header>
                    <Modal.Title>Зв'язатися з продавцем</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contactError && <Alert variant="danger">{contactError}</Alert>}
                    {contactSuccess && <Alert variant="success">{contactSuccess}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Ваше ім'я</Form.Label>
                            <Form.Control
                                value={contactName}
                                onChange={e => setContactName(e.target.value)}
                                placeholder="Ім'я (необов'язково)"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email для відповіді</Form.Label>
                            <Form.Control
                                type="email"
                                value={contactEmail}
                                onChange={e => setContactEmail(e.target.value)}
                                placeholder="email@example.com"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Повідомлення</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={contactMessage}
                                onChange={e => setContactMessage(e.target.value)}
                                placeholder="Опишіть ваш запит"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setContactVisible(false)}>Закрити</Button>
                    <Button variant="primary" onClick={submitContact} disabled={contactSending}>
                        {contactSending ? 'Відправка...' : 'Надіслати'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default PropertyPage;
