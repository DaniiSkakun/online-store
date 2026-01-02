import React, { useContext, useEffect } from 'react';
import { Container, Row, Alert } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import PropertyItem from '../components/PropertyItem';
import { getUserFavorites } from '../http/favoriteAPI';

const Favorites = observer(() => {
    const { user, property } = useContext(Context);

    useEffect(() => {
        if (user.isAuth) {
            getUserFavorites().then(data => {
                property.setFavorites(data);
            }).catch(error => {
                console.error('Помилка завантаження обраного:', error);
            });
        }
    }, [user.isAuth]); // Убрали property из зависимостей, чтобы не было лишних перерендеров

    if (!user.isAuth) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">
                    <Alert.Heading>Потрібна авторизація</Alert.Heading>
                    <p>Щоб переглянути обране, увійдіть в систему або зареєструйтеся.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Обране</h2>

            {property.favorites.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>Обране порожнє</Alert.Heading>
                    <p>Додайте нерухомість в обране, щоб вона з'явилася тут.</p>
                </Alert>
            ) : (
                <Row>
                    {property.favorites.map(favorite => (
                        <PropertyItem
                            key={favorite.id}
                            property={favorite.property}
                            isAdmin={false}
                            isFavoritesPage={true}
                        />
                    ))}
                </Row>
            )}
        </Container>
    );
});

export default Favorites;
