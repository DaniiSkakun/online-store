import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const DistrictBar = observer(() => {
    const {property} = useContext(Context)
    const [search, setSearch] = useState('')
    const [showAll, setShowAll] = useState(false)

    const selectedCityIds = property.selectedCities?.map(c => c.id) || [];
    const cleanName = (name) => name.replace(/\s*\(.*\)$/, '');

    const districtTranslations = {
        'Амур-Нижньодніпровський': 'Амур-Нижньодніпровський',
        'Амур-Нижнеднепровский': 'Амур-Нижньодніпровський',
        'Галицкий': 'Галицький',
        'Галицький': 'Галицький',
        'Голосеевский': 'Голосіївський',
        'Голосіївський': 'Голосіївський',
        'Дарницкий': 'Дарницький',
        'Дарницький': 'Дарницький',
        'Деснянский': 'Деснянський',
        'Деснянський': 'Деснянський',
        'Днепровский': 'Дніпровський',
        'Дніпровський': 'Дніпровський',
        'Днепровский Херсон': 'Дніпровський (Херсон)',
        'Дніпровський Херсон': 'Дніпровський (Херсон)',
        'Довгинцівський': 'Довгинцівський',
        'Довгинцевский': 'Довгинцівський',
        'Жовтневий Харків': 'Жовтневий (Харків)',
        'Жовтневий Харков': 'Жовтневий (Харків)',
        'Жовтневый Харков': 'Жовтневий (Харків)',
        'Заводський Запоріжжя': 'Заводський (Запоріжжя)',
        'Заводский Запорожье': 'Заводський (Запоріжжя)',
        'Печерский': 'Печерський',
        'Шевченковский': 'Шевченківський',
        'Подольский': 'Подільський',
        'Оболонский': 'Оболонський',
        'Святошинский': 'Святошинський',
        'Слободской': 'Слобідський',
        'Холодногорский': 'Холодногірський',
        'Приморский': 'Приморський',
        'Малиновский': 'Малиновський',
        'Суворовский': 'Суворовський',
        'Центральный': 'Центральний',
        'Чечеловский': 'Чечелівський',
        'Индустриальный': 'Індустріальний',
        'Франковский': 'Франківський',
        'Лычаковский': 'Личаківський',
        'Киевский': 'Київський',
        'Криворожский': 'Криворізький'
    };

    const translateDistrict = (name = '') => {
        const base = cleanName(name);
        return districtTranslations[base] || base;
    };

    const allDistricts = [...property.districts]
        .sort((a, b) => translateDistrict(a.name).localeCompare(translateDistrict(b.name), 'uk'));

    const filteredDistricts = selectedCityIds.length
        ? property.districts.filter(d => selectedCityIds.includes(d.cityId))
        : property.districts;

    const districts = [...filteredDistricts]
        .filter(d => translateDistrict(d.name).toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => translateDistrict(a.name).localeCompare(translateDistrict(b.name), 'uk'));

    const hasMany = allDistricts.length > 10;
    const selected = property.selectedDistricts;
    const selectedIds = selected.map(d => d.id);

    // Для больших списков показываем выбранные отдельно, а в десятке — только невыбранные
    const baseVisible = hasMany
        ? districts.filter(d => !selectedIds.includes(d.id)).slice(0, 10)
        : districts;

    const visibleDistricts = baseVisible;
    const visibleIds = visibleDistricts.map(d => d.id).concat(selectedIds);
    const remainingDistricts = districts.filter(d => !visibleIds.includes(d.id));

    const clear = () => {
        property.clearDistricts();
    }

    return (
        <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold mb-0" style={{fontSize: '1.15rem', color: '#1a1a1a', fontWeight: 700}}>Адреса</Form.Label>
                {property.selectedDistricts.length > 0 && (
                    <Button variant="danger" size="sm" onClick={clear} style={{color: 'white'}}>
                        Скинути
                    </Button>
                )}
            </div>
            <Form.Control
                type="text"
                size="sm"
                placeholder="Пошук за адресою"
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{borderRadius: 10}}
            />
            {selectedCityIds.length > 0 && (
                <div className="text-muted small mb-2">
                    Показані райони вибраних міст
                </div>
            )}
            {(!hasMany || visibleDistricts.length > 0) && (
                <div className="d-flex flex-wrap gap-2">
                    {visibleDistricts.map(district => {
                        const active = property.selectedDistricts.some(d => d.id === district.id);
                        return (
                            <Badge
                                key={district.id}
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
                                onClick={() => property.toggleDistrict(district)}
                            >
                                {translateDistrict(district.name)}
                            </Badge>
                        )
                    })}
                </div>
            )}
            {hasMany && (
                <>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {property.selectedDistricts.map(district => (
                            <Badge
                                key={district.id}
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
                                onClick={() => property.toggleDistrict(district)}
                            >
                                {translateDistrict(district.name)}
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
                            {showAll ? 'Сховати всі адреси' : 'Показати всі адреси'}
                        </Button>
                    </div>
                    {showAll && (
                        <div
                            className="border rounded mt-2 p-2"
                            style={{maxHeight: 220, overflowY: 'auto', background: '#f8f9fa'}}
                        >
                            {remainingDistricts.map(district => {
                                const active = property.selectedDistricts.some(d => d.id === district.id);
                                return (
                                    <div
                                        key={district.id}
                                        className="py-1 small"
                                        style={{cursor: 'pointer', fontWeight: active ? 600 : 400}}
                                        onClick={() => property.toggleDistrict(district)}
                                    >
                                        {translateDistrict(district.name)}
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

export default DistrictBar;


