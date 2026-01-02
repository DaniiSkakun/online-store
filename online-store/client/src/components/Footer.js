import React from 'react';
import {Container, Row, Col, Nav} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {SHOP_ROUTE, ABOUT_ROUTE, SERVICES_ROUTE, CONTACTS_ROUTE} from "../utils/consts";

const Footer = () => {
    const history = useHistory();

    return (
        <footer style={{
            backgroundColor: '#343a40',
            color: 'white',
            padding: '20px 0 2px 0' // увеличили верхний отступ, низ оставили коротким
        }}>
            <Container style={{maxWidth: '1200px'}}>
                <Row className="g-2">
                    {/* Логотип и описание */}
                    <Col lg={3} md={6} className="mb-0">
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                            {/* Иконка с двумя буквами */}
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: 'black',
                                    borderRadius: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '10px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        color: 'white'
                                    }}
                                >
                                НУ
                            </div>

                            {/* Заголовок футера */}
                            <h5 style={{color: '#fff', margin: 0}}>
                                Нерухомість Україна
                            </h5>
                        </div>
                        <p style={{color: '#adb5bd', lineHeight: '1.2', marginBottom: '4px'}}>
                            Ваш надійний партнер у пошуку нерухомості.
                            Знаходимо ідеальний дім для кожного клієнта.
                        </p>
                        <div>
                            <small style={{color: '#6c757d'}}>
                                © 2025 Нерухомість Україна. Всі права захищені.
                            </small>
                        </div>
                    </Col>

                    {/* Быстрые ссылки */}
                    <Col lg={3} md={3} sm={6} className="mb-0">
                        <h6 style={{color: '#fff', marginBottom: '4px'}}>Навігація</h6>
                        <Nav className="flex-column">
                            <Nav.Link
                                onClick={() => history.push(SHOP_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Головна
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(ABOUT_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Про нас
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(SERVICES_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Послуги
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(CONTACTS_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Контакти
                            </Nav.Link>
                        </Nav>
                    </Col>

                    {/* Услуги */}
                    <Col lg={3} md={3} sm={6} className="mb-0">
                        <h6 style={{color: '#fff', marginBottom: '4px'}}>Послуги</h6>
                        <Nav className="flex-column">
                            <Nav.Link
                                onClick={() => history.push(SERVICES_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Продаж нерухомості
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(SERVICES_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Оренда житла
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(SERVICES_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Консультації
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => history.push(SERVICES_ROUTE)}
                                style={{
                                    color: '#adb5bd',
                                    padding: '5px 0',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                            >
                                Оцінка майна
                            </Nav.Link>
                        </Nav>
                    </Col>

                    {/* Контакты */}
                    <Col lg={3} md={12} className="mb-0">
                        <h6 style={{color: '#fff', marginBottom: '4px'}}>Контакти</h6>
                        <div style={{marginBottom: '4px'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '3px'}}>
                                <span style={{color: '#28a745', marginRight: '6px'}}>📍</span>
                                <span style={{color: '#adb5bd'}}>м. Київ, вул. Хрещатик, 1</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '3px'}}>
                                <span style={{color: '#28a745', marginRight: '6px'}}>📞</span>
                                <span style={{color: '#adb5bd'}}>+38 (098) 737-35-27</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '3px'}}>
                                <span style={{color: '#28a745', marginRight: '6px'}}>✉️</span>
                                <span style={{color: '#adb5bd'}}>235736@duan.edu.ua</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{color: '#28a745', marginRight: '6px'}}>🕒</span>
                                <span style={{color: '#adb5bd'}}>Пн-Пт: 9:00-18:00</span>
                            </div>
                        </div>

                        {/* Социальные сети */}
                        <div>
                            <h6 style={{color: '#fff', marginBottom: '5px'}}>Ми в соцмережах</h6>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                                    color: '#adb5bd',
                                    fontSize: '20px',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                                >📘</a>

                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                                    color: '#adb5bd',
                                    fontSize: '20px',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                                >🐦</a>

                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                                    color: '#adb5bd',
                                    fontSize: '20px',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                                >📷</a>

                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                                    color: '#adb5bd',
                                    fontSize: '20px',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#adb5bd'}
                                >💼</a>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Нижняя часть футера */}
                <hr style={{borderColor: '#495057', margin: '6px 0 4px 0'}} />
                <Row>
                    <Col className="text-center">
                        <small style={{color: '#6c757d'}}>
                            Розроблено з ❤️ для ринку нерухомості України
                        </small>
                        <br />
                        <small style={{color: '#6c757d', marginTop: '1px', display: 'block'}}>
                            Використання матеріалів тільки з дозволу власника
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;