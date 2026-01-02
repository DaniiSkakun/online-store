import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const PropertyTypeBar = observer(() => {
    const {property} = useContext(Context)

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

    const translateType = (name = '') => typeTranslations[name] || name;

    const types = [...property.propertyTypes].sort((a, b) => translateType(a.name).localeCompare(translateType(b.name), 'uk'));

    const clear = () => {
        property.clearPropertyTypes();
    }

    return (
        <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold mb-0" style={{fontSize: '1.15rem', color: '#1a1a1a', fontWeight: 700}}>Тип нерухомості</Form.Label>
                {property.selectedPropertyTypes.length > 0 && (
                    <Button variant="danger" size="sm" onClick={clear} style={{color: 'white'}}>
                        Скинути
                    </Button>
                )}
            </div>
            <div className="d-flex flex-wrap gap-2">
                {types.map(type => {
                    const active = property.selectedPropertyTypes.some(t => t.id === type.id);
                    return (
                        <Badge
                            key={type.id}
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
                            onClick={() => property.togglePropertyType(type)}
                        >
                            {translateType(type.name)}
                        </Badge>
                    )
                })}
            </div>
        </Form.Group>
    );
});

export default PropertyTypeBar;


