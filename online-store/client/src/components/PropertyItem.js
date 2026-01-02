import React, { useContext, useState } from 'react';
import {Card, Col, Button} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import {useHistory} from "react-router-dom"
import {PROPERTY_ROUTE} from "../utils/consts";
import { Context } from "../index";
import { addToFavorite, removeFromFavorite, getUserFavorites } from '../http/favoriteAPI';
import {observer} from "mobx-react-lite";

const PropertyItem = observer(({property, isAdmin = false, isFavoritesPage = false, onEdit, onDelete}) => {
    const history = useHistory()
    const { user, property: propertyStore } = useContext(Context)
    const [isHovered, setIsHovered] = useState(false)

    // Функция для форматирования цены
    const formatPrice = (price) => {
        return new Intl.NumberFormat('uk-UA').format(price) + ' ₴'
    }

    // Функция для сокращения адреса
    const shortenAddress = (address) => {
        return address.length > 30 ? address.substring(0, 30) + '...' : address
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

    // Функция для получения типа недвижимости на украинском
    const getPropertyTypeName = (type) => {
        const types = {
            // коди
            'apartment': 'Квартира',
            'house': 'Будинок',
            'land': 'Ділянка',
            'office': 'Офіс',
            'commercial': 'Комерційна нерухомість',
            // можливі російські значення
            'Квартира': 'Квартира',
            'Дом': 'Будинок',
            'Участок': 'Ділянка',
            'Офис': 'Офіс',
            'Коммерческая недвижимость': 'Комерційна нерухомість',
            'Коммерческая': 'Комерційна нерухомість'
        }
        return types[type] || type
    }

    // Обработчик клика по карточке
    const handleCardClick = () => {
        if (!isAdmin) {
            history.push(PROPERTY_ROUTE + '/' + property.id)
        }
    }

    // Обработчик добавления/удаления из избранного
    const handleFavoriteToggle = async (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

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

    return (
        <Col md={4} className="mt-3 mb-3 d-flex justify-content-center" onClick={handleCardClick}>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: '100%',
                    minHeight: isAdmin ? 450 : 400,
                    cursor: isAdmin ? 'default' : 'pointer',
                    backgroundColor: '#fefefe',
                    borderRadius: 12,
                    border: '1px solid #dee2e6',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}
                border={"light"}
            >
                <div style={{position: 'relative'}}>
                    {property.images && property.images.length > 0 ? (
                        <Image
                            width="100%"
                            height={280}
                            src={process.env.REACT_APP_API_URL + property.images[0]}
                            style={{objectFit: 'cover', display: 'block'}}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: 280,
                                backgroundColor: '#fefefe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.25rem'
                            }}
                        >
                            <div style={{textAlign: 'center', color: '#6c757d'}}>
                                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏠</div>
                                <div style={{fontSize: '0.9rem'}}>Немає фото</div>
                            </div>
                        </div>
                    )}
                    {/* Кнопка избранного или удаления */}
                    {!isAdmin && (
                        isFavoritesPage ? (
                            // На странице избранного - кнопка удаления (только при наведении)
                            isHovered && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFavoriteToggle();
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        borderRadius: '20px',
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        opacity: 0.9
                                    }}
                                >
                                    🗑️ Видалити
                                </Button>
                            )
                        ) : (
                            // На главной странице - кнопка добавления в избранное
                            (propertyStore.isInFavorites(property.id) || isHovered) && (
                                <div
                                    onClick={handleFavoriteToggle}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        borderRadius: '50%',
                                        width: '35px',
                                        height: '35px',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.9,
                                        backgroundColor: propertyStore.isInFavorites(property.id) ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                        color: '#2f343a',
                                        fontSize: '22px',
                                        cursor: 'pointer',
                                        border: propertyStore.isInFavorites(property.id) ? '2px solid white' : '2px solid rgba(0, 0, 0, 0.3)',
                                        outline: 'none',
                                        boxShadow: propertyStore.isInFavorites(property.id) ? '0 2px 6px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                                        backdropFilter: propertyStore.isInFavorites(property.id) ? 'none' : 'blur(1px)',
                                        WebkitTextStroke: '0',
                                        textShadow: 'none',
                                        fontWeight: 700
                                    }}
                                >
                                    {propertyStore.isInFavorites(property.id) ? '★' : '☆'}
                                </div>
                            )
                        )
                    )}

                    {property.images && property.images.length > 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                        >
                            📸 {property.images.length}
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <div className="mb-2 fw-semibold text-dark">
                        Тип: <span className="text-muted">{property.property_type ? getPropertyTypeName(property.property_type) : 'Не вказано'}</span>
                    </div>

                    <div className="mb-2 fw-semibold text-dark">
                        Місто: <span className="text-muted">{getCityName(property.city) || 'Не вказано'}</span>
                    </div>

                    <div className="mb-2 fw-semibold text-dark">
                        Адреса: <span className="text-muted">{shortenAddress(property.address)}</span>
                    </div>

                    <div className="fw-bold fs-5 text-success mb-2">
                        {formatPrice(property.price)}
                    </div>

                    <div className="d-flex justify-content-between text-muted small">
                        <span>{property.area} м²</span>
                        <span>{property.rooms} кімн.</span>
                        <span>{property.floor ? `${property.floor}/${property.total_floors || '?'}` : ''}</span>
                    </div>

                    {isAdmin && (
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                    variant="primary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                style={{borderRadius: '20px', flex: 1, marginRight: '0.5rem'}}
                            >
                                ✏️ Редагувати
                            </Button>
                            <Button
                                    variant="danger"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                style={{borderRadius: '20px', flex: 1, marginLeft: '0.5rem'}}
                            >
                                🗑️ Видалити
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </Col>
    );
});

export default PropertyItem;


