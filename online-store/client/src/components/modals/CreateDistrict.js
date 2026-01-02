import React, {useContext, useEffect, useMemo, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";
import {createDistrict} from "../../http/propertyAPI";
import {Context} from "../../index";

const CreateDistrict = ({show, onHide}) => {
    const {property} = useContext(Context)
    const [name, setName] = useState('')
    const [cityId, setCityId] = useState(null)
    const [search, setSearch] = useState('')

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
        'Харьков': 'Харків'
    };

    const getCityName = (name = '') => cityTranslations[name] || name;

    useEffect(() => {
        if (show && property.cities.length > 0 && !cityId) {
            setCityId(property.cities[0].id)
        }
    }, [show, property.cities, cityId])

    const filteredCities = useMemo(() => {
        return property.cities
            .map(c => ({...c, displayName: getCityName(c.name)}))
            .filter(c => c.displayName.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => a.displayName.localeCompare(b.displayName, 'uk'));
    }, [property.cities, search]);

    const addDistrict = () => {
        if (!name.trim()) {
            alert('Введіть назву району')
            return
        }
        if (!cityId) {
            alert('Оберіть місто')
            return
        }
        createDistrict({name, cityId}).then(() => {
            setName('')
            setCityId(property.cities[0]?.id || null)
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton closeVariant="dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати район
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Назва району"
                    />
                    <Form.Label className="mt-3 mb-1 fw-semibold">Місто</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Пошук міста..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-2"
                    />
                    <div style={{maxHeight: 180, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: '4px 6px'}}>
                        {filteredCities.length === 0 && (
                            <div className="text-muted small px-1 py-2">Немає збігів</div>
                        )}
                        {filteredCities.map(city => (
                            <div
                                key={city.id}
                                className={`d-flex justify-content-between align-items-center px-2 py-1 rounded ${cityId === city.id ? 'bg-light' : ''}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => setCityId(city.id)}
                            >
                                <span>{city.displayName}</span>
                                {cityId === city.id && <span className="text-success fw-bold">●</span>}
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Закрити</Button>
                <Button variant="success" onClick={addDistrict}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateDistrict;








