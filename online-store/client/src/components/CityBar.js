import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const CityBar = observer(() => {
    const {property} = useContext(Context)
    const [search, setSearch] = useState('')
    const [showAll, setShowAll] = useState(false)

    const clear = () => property.clearCities && property.clearCities();

    const cityTranslations = {
        'Киев': 'Київ',
        'Харьков': 'Харків',
        'Одесса': 'Одеса',
        'Днепр': 'Дніпро',
        'Житомир': 'Житомир',
        'Запорожье': 'Запоріжжя',
        'Запоріжжя': 'Запоріжжя',
        'Ивано-Франковск': 'Івано-Франківськ',
        'Івано-Франківськ': 'Івано-Франківськ',
        'Кривой Рог': 'Кривий Ріг',
        'Луцк': 'Луцьк',
        'Львов': 'Львів',
        'Николаев': 'Миколаїв',
        'Мариуполь': 'Маріуполь',
        'Маріуполь': 'Маріуполь',
        'Днепропетровск': 'Дніпро',
        'Дніпро': 'Дніпро',
        'Винница': 'Вінниця',
        'Вінниця': 'Вінниця',
    };

    const getCityName = (name = '') => cityTranslations[name] || name;

    // Получаем выбранные районы для фильтрации городов
    const selectedDistrictIds = property.selectedDistricts?.map(d => d.id) || [];

    // Если выбраны районы, показываем только города, содержащие эти районы
    const availableCities = selectedDistrictIds.length > 0
        ? property.cities.filter(city =>
            property.districts.some(district =>
                district.cityId === city.id && selectedDistrictIds.includes(district.id)
            )
        )
        : property.cities;

    const allCities = [...(availableCities || [])].sort((a, b) => getCityName(a.name).localeCompare(getCityName(b.name), 'uk'));
    const cities = [...(availableCities || [])]
        .filter(c => getCityName(c.name).toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => getCityName(a.name).localeCompare(getCityName(b.name), 'uk'));
    const hasMany = allCities.length > 10;
    const selected = property.selectedCities || [];
    const selectedIds = selected.map(c => c.id);

    // Для больших списков: показываем выбранные отдельно, а в видимой десятке — только невыбранные
    const baseVisible = hasMany
        ? cities.filter(c => !selectedIds.includes(c.id)).slice(0, 10)
        : cities;

    const visibleCities = baseVisible;
    const visibleIds = visibleCities.map(c => c.id).concat(selectedIds);
    const remainingCities = allCities.filter(c => !visibleIds.includes(c.id));

    return (
        <Form.Group className="mb-3 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold mb-0" style={{fontSize: '1.15rem', color: '#1a1a1a', fontWeight: 700}}>Місто</Form.Label>
                {property.selectedCities && property.selectedCities.length > 0 && (
                    <Button variant="danger" size="sm" onClick={clear} style={{color: 'white'}}>
                        Скинути
                    </Button>
                )}
            </div>
            <Form.Control
                type="text"
                size="sm"
                placeholder="Пошук міста"
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{borderRadius: 10}}
            />
            {selectedDistrictIds.length > 0 && (
                <div className="text-muted small mb-2">
                    Показані міста з вибраними районами
                </div>
            )}
            {(!hasMany || visibleCities.length > 0) && (
                <div className="d-flex flex-wrap gap-2">
                    {visibleCities.map(city => {
                        const active = (property.selectedCities || []).some(c => c.id === city.id);
                        return (
                            <Badge
                                key={city.id}
                                bg={active ? "success" : "light"}
                                text={active ? "light" : "dark"}
                                style={{
                                    cursor: 'pointer',
                                    padding: '12px 16px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: 12,
                                    fontSize: '0.95rem',
                                    margin: '4px'
                                }}
                                onClick={() => property.toggleCity && property.toggleCity(city)}
                            >
                                {getCityName(city.name)}
                            </Badge>
                        )
                    })}
                </div>
            )}
            {hasMany && (
                <>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {(property.selectedCities || []).map(city => (
                            <Badge
                                key={city.id}
                                bg={"success"}
                                text={"light"}
                                style={{
                                    cursor: 'pointer',
                                    padding: '12px 16px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: 12,
                                    fontSize: '0.95rem',
                                    margin: '4px'
                                }}
                                onClick={() => property.toggleCity && property.toggleCity(city)}
                            >
                                {getCityName(city.name)}
                            </Badge>
                        ))}
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setShowAll(!showAll)}
                            style={{ textDecoration: 'none', padding: '0.25rem 0.5rem', color: '#0056b3' }}
                        >
                            {showAll ? 'Сховати всі міста' : 'Показати всі міста'}
                        </Button>
                    </div>
                    {showAll && (
                        <div
                            className="border rounded mt-2 p-2"
                            style={{maxHeight: 200, overflowY: 'auto', background: '#f8f9fa'}}
                        >
                            {remainingCities.map(city => {
                                const active = (property.selectedCities || []).some(c => c.id === city.id);
                                return (
                                    <div
                                        key={city.id}
                                        className="py-1 small"
                                        style={{cursor: 'pointer', fontWeight: active ? 600 : 400}}
                                        onClick={() => property.toggleCity && property.toggleCity(city)}
                                    >
                                        {getCityName(city.name)}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </Form.Group>
    );
});

export default CityBar;




