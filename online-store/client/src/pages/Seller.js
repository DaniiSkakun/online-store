import React, {useContext, useEffect, useState} from 'react';
import {Button, Container, Row, Col, Card} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchUserProperties, deleteProperty, fetchPropertyTypes, fetchDistricts, fetchCities} from "../http/propertyAPI";
import PropertyItem from "../components/PropertyItem";
import CreateProperty from "../components/modals/CreateProperty";
import EditProperty from "../components/modals/EditProperty";

const Seller = observer(() => {
    const {user, property} = useContext(Context)
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [propertyVisible, setPropertyVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [propertyToEdit, setPropertyToEdit] = useState(null)

    useEffect(() => {
        console.log('🔄 Загрузка недвижимости продавца...')

        // Загружаем типы, районы и города для модального окна
        const loadData = async () => {
            try {
                if (property.propertyTypes.length === 0) {
                    await fetchPropertyTypes().then(data => property.setPropertyTypes(data))
                }
                if (property.districts.length === 0) {
                    await fetchDistricts().then(data => property.setDistricts(data))
                }
                if (property.cities.length === 0) {
                    await fetchCities().then(data => property.setCities(data))
                }

                // Загружаем недвижимость продавца
                const data = await fetchUserProperties()
                console.log('✅ Получено данных:', data.length)
                setProperties(data || [])
            } catch (error) {
                console.error('❌ Помилка завантаження:', error)
                setProperties([])
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [property])

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю нерухомість?')) {
            try {
                await deleteProperty(id)
                setProperties(properties.filter(property => property.id !== id))
            } catch (e) {
                alert(e.response?.data?.message || 'Помилка при видаленні')
            }
        }
    }

    const handleEdit = (propertyToEdit) => {
        setPropertyToEdit(propertyToEdit)
        setEditVisible(true)
    }

    const handleEditComplete = (updatedProperty) => {
        // Обновляем объявление в списке
        setProperties(properties.map(prop =>
            prop.id === updatedProperty.id ? updatedProperty : prop
        ))
        setEditVisible(false)
        setPropertyToEdit(null)
    }

    if (loading) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка...</span>
            </div>
        </div>
    }

    return (
        <Container>
            <Row className="mt-4 align-items-center">
                <Col>
                    <h2>Мої оголошення</h2>
                </Col>
                <Col xs="auto" className="ms-auto">
                    <Button
                        variant={"success"}
                        size="lg"
                        style={{padding: '12px 32px', fontWeight: 700, borderRadius: 12}}
                        onClick={() => setPropertyVisible(true)}
                    >
                        Додати нерухомість
                    </Button>
                </Col>
            </Row>

            <Row className="mt-4 g-4">
                {properties.length > 0 ? (
                    properties.map(property => (
                        <PropertyItem
                            key={property.id}
                            property={property}
                            isAdmin={true}
                            onEdit={() => handleEdit(property)}
                            onDelete={() => handleDelete(property.id)}
                        />
                    ))
                ) : (
                    <Col className="text-center mt-5">
                        <p className="text-muted">У вас поки немає оголошень</p>
                        <Button
                            variant={"success"}
                            onClick={() => setPropertyVisible(true)}
                        >
                            Створити перше оголошення
                        </Button>
                    </Col>
                )}
            </Row>

            <CreateProperty
                show={propertyVisible}
                onHide={() => setPropertyVisible(false)}
                onCreate={() => {
                    // Перезагрузка списка после создания
                    fetchUserProperties().then(data => setProperties(data))
                    setPropertyVisible(false)
                }}
            />

            <EditProperty
                show={editVisible}
                onHide={() => {
                    setEditVisible(false)
                    setPropertyToEdit(null)
                }}
                propertyToEdit={propertyToEdit}
                onEdit={handleEditComplete}
            />
        </Container>
    );
});

export default Seller;
