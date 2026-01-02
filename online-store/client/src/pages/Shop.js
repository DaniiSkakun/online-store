import React, {useContext, useEffect} from 'react';
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropertyTypeBar from "../components/PropertyTypeBar";
import DistrictBar from "../components/DistrictBar";
import CityBar from "../components/CityBar";
import SearchBar from "../components/SearchBar";
import SortingBar from "../components/SortingBar";
import PropertyList from "../components/PropertyList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchDistricts, fetchProperties, fetchPropertyTypes, fetchCities} from "../http/propertyAPI";
import {getUserFavorites} from "../http/favoriteAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
    const {property, user} = useContext(Context)

    useEffect(() => {
        console.log('🏪 Загрузка данных магазина...')

        fetchPropertyTypes().then(data => {
            console.log('🏷️ Загружено типов недвижимости:', data.length)
            property.setPropertyTypes(data)
        }).catch(err => console.error('❌ Помилка завантаження типів:', err))

        fetchDistricts().then(data => {
            console.log('🏘️ Загружено районов:', data.length)
            property.setDistricts(data)
        }).catch(err => console.error('❌ Помилка завантаження районів:', err))

        fetchCities().then(data => {
            console.log('🏙️ Загружено городов:', data.length)
            property.setCities(data)
        }).catch(err => console.error('❌ Помилка завантаження міст:', err))

        fetchProperties([], [], [], '', 1, 9).then(data => {
            console.log('🏠 Загружено недвижимости:', data.count, 'объектов')
            console.log('📋 Данные недвижимости:', data.rows)
            property.setProperties(data.rows)
            property.setTotalCount(data.count)
        }).catch(err => console.error('❌ Помилка завантаження нерухомості:', err))
    }, [])

    // Загружаем избранное для авторизованных пользователей
    useEffect(() => {
        if (user.isAuth && property.favorites.length === 0) {
            getUserFavorites().then(data => {
                property.setFavorites(data)
                console.log('⭐ Загружено избранное на главной странице:', data.length, 'объектов')
            }).catch(err => console.error('❌ Помилка завантаження обраного:', err))
        }
    }, [user.isAuth, property])

    useEffect(() => {
        console.log('🔍 Выполняем поиск с параметрами:', {
            types: property.selectedPropertyTypes.length,
            districts: property.selectedDistricts.length,
            search: property.searchQuery,
            page: property.page
        })

        fetchProperties(
            property.selectedPropertyTypes,
            property.selectedDistricts,
            property.selectedCities,
            property.searchQuery,
            property.page,
            9,
            property.sortBy,
            property.sortOrder
        ).then(data => {
            console.log('📦 Получено результатов:', data.count)
            property.setProperties(data.rows)
            property.setTotalCount(data.count)
        }).catch(error => {
            console.error('❌ Помилка при завантаженні даних:', error)
        })
    }, [
        property.page,
        property.searchQuery,
        property.sortBy,
        property.sortOrder,
        JSON.stringify(property.selectedPropertyTypes),
        JSON.stringify(property.selectedDistricts),
        JSON.stringify(property.selectedCities)
    ])

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <CityBar/>
                    <DistrictBar/>
                    <PropertyTypeBar/>
                </Col>
                <Col md={9}>
                    <SearchBar/>
                    <SortingBar/>
                    <PropertyList/>
                    <Pages/>
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
