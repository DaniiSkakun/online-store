import React, {useState, useEffect, useContext} from 'react';
import {Button, Container, Row, Col, Card} from "react-bootstrap";
import CreateDistrict from "../components/modals/CreateDistrict";
import CreateProperty from "../components/modals/CreateProperty";
import CreatePropertyType from "../components/modals/CreatePropertyType";
import EditProperty from "../components/modals/EditProperty";
import PropertyItem from "../components/PropertyItem";
import {seedDatabase} from "../utils/seedDatabase";
import {fetchProperties, deleteProperty} from "../http/propertyAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Admin = observer(() => {
    const {user} = useContext(Context);
    const [districtVisible, setDistrictVisible] = useState(false);
    const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
    const [propertyVisible, setPropertyVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await fetchProperties();
            setProperties(data.rows || []);
        } catch (error) {
            console.error('Помилка завантаження нерухомості:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (property) => {
        setPropertyToEdit(property);
        setEditVisible(true);
    };

    const handleEditComplete = (updatedProperty) => {
        setProperties(properties.map(prop =>
            prop.id === updatedProperty.id ? updatedProperty : prop
        ));
        setEditVisible(false);
        setPropertyToEdit(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю нерухомість?')) {
            try {
                await deleteProperty(id);
                setProperties(properties.filter(property => property.id !== id));
            } catch (error) {
                alert('Помилка при видаленні: ' + error.message);
            }
        }
    };

    const handleSeedDatabase = async () => {
        if (window.confirm('Ви впевнені, що хочете наповнити базу даних тестовими даними? Це може зайняти деякий час.')) {
            setIsSeeding(true);
            try {
                await seedDatabase();
                alert('База даних успішно наповнена!');
            } catch (error) {
                alert('Помилка при наповненні бази даних: ' + error.message);
            } finally {
                setIsSeeding(false);
            }
        }
    };

    return (
        <Container className="d-flex flex-column">
            <h2 className="mt-4 mb-4">Админ панель</h2>

            {/* Кнопки управления */}
            <div className="mb-4">
                <h4>Управление данными</h4>
                <Row>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setPropertyTypeVisible(true)}
                        >
                            ➕ Тип недвижимости
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setDistrictVisible(true)}
                        >
                            ➕ Район
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-dark"}
                            className="w-100"
                            onClick={() => setPropertyVisible(true)}
                        >
                            ➕ Недвижимость
                        </Button>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Button
                            variant={"outline-success"}
                            className="w-100"
                            onClick={handleSeedDatabase}
                            disabled={isSeeding}
                        >
                            {isSeeding ? '⏳ Наполнение...' : '🚀 Тестовые данные'}
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Список недвижимости для редактирования */}
            <div>
                <h4>Управление недвижимостью ({properties.length} объектов)</h4>
                {loading ? (
                    <div className="text-center mt-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                ) : properties.length > 0 ? (
                    <Row>
                        {properties.map(property => (
                            <Col md={6} lg={4} key={property.id} className="mb-4">
                                <Card className="h-100">
                                    <PropertyItem property={property} />
                                    <Card.Footer className="d-flex justify-content-between">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleEdit(property)}
                                        >
                                            ✏️ Редактировать
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(property.id)}
                                        >
                                            🗑️ Удалить
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center mt-4 text-muted">
                        <p>🏠 Недвижимости пока нет</p>
                        <p>Добавьте объекты через кнопку выше</p>
                    </div>
                )}
            </div>

            <CreateDistrict
                show={districtVisible}
                onHide={() => setDistrictVisible(false)}
            />
            <CreateProperty
                show={propertyVisible}
                onHide={() => setPropertyVisible(false)}
                onCreate={() => {
                    loadProperties();
                    setPropertyVisible(false);
                }}
            />
            <CreatePropertyType
                show={propertyTypeVisible}
                onHide={() => setPropertyTypeVisible(false)}
            />
            <EditProperty
                show={editVisible}
                onHide={() => {
                    setEditVisible(false);
                    setPropertyToEdit(null);
                }}
                propertyToEdit={propertyToEdit}
                onEdit={handleEditComplete}
            />
        </Container>
    );
});

export default Admin;

