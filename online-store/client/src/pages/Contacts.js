import React from 'react';
import {Container, Row, Col, Card, Button} from "react-bootstrap";

const Contacts = () => {
    return (
        <Container style={{paddingTop: '50px', paddingBottom: '50px'}}>
            <h1 className="mb-4 text-center">Контакти</h1>

            <Row className="mb-5">
                <Col lg={8} className="mx-auto">
                    <p className="lead text-center mb-5">
                        Зв'яжіться з нами будь-яким зручним способом. Ми завжди раді допомогти!
                    </p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>📞</span>
                            </div>
                            <h4 className="card-title mb-3">Телефон</h4>
                            <p className="card-text">
                                Зателефонуйте нам для отримання консультації
                            </p>
                            <h5 className="text-primary mb-3">+38 (098) 737-35-27</h5>
                            <p className="text-muted small">
                                Пн-Пт: 9:00 - 18:00<br/>
                                Сб: 10:00 - 16:00
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>📧</span>
                            </div>
                            <h4 className="card-title mb-3">Email</h4>
                            <p className="card-text">
                                Напишіть нам листа з вашим питанням
                            </p>
                            <h5 className="text-primary mb-3">235736@duan.edu.ua</h5>
                            <p className="text-muted small">
                                Відповідаємо протягом<br/>
                                2-3 годин у робочий час
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>📍</span>
                            </div>
                            <h4 className="card-title mb-3">Адреса</h4>
                            <p className="card-text">
                                Відвідайте наш офіс у центрі міста
                            </p>
                            <h5 className="text-primary mb-3">м. Київ</h5>
                            <p className="text-muted small">
                                вул. Хрещатик, 1<br/>
                                Бізнес-центр "Глобус"
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col lg={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <h4 className="mb-4 text-center">Форма зворотнього зв'язку</h4>
                            <form>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <label htmlFor="name" className="form-label">Ім'я *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Ваше ім'я"
                                            required
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label htmlFor="phone" className="form-label">Телефон *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            placeholder="+38 (___) ___-__-__"
                                            required
                                        />
                                    </Col>
                                </Row>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="service" className="form-label">Послуга, що цікавить</label>
                                    <select className="form-select" id="service">
                                        <option value="">Оберіть послугу</option>
                                        <option value="sale">Продаж нерухомості</option>
                                        <option value="rent">Оренда житла</option>
                                        <option value="consultation">Консультації</option>
                                        <option value="valuation">Оцінка майна</option>
                                        <option value="other">Інше</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Повідомлення *</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="4"
                                        placeholder="Опишіть ваше питання або побажання..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <Button variant="primary" size="lg" type="submit">
                                        Надіслати повідомлення
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={10} className="mx-auto">
                    <Card className="bg-light">
                        <Card.Body className="text-center p-4">
                            <h4 className="mb-3">Швидкий зв'язок</h4>
                            <p className="mb-3">
                                Для термінових питань телефонуйте нам безпосередньо або пишіть у месенджери
                            </p>
                            <Row className="justify-content-center">
                                <Col md={3} sm={6} className="mb-2">
                                    <Button variant="outline-primary" className="w-100">
                                        📱 Viber
                                    </Button>
                                </Col>
                                <Col md={3} sm={6} className="mb-2">
                                    <Button variant="outline-success" className="w-100">
                                        📱 Telegram
                                    </Button>
                                </Col>
                                <Col md={3} sm={6} className="mb-2">
                                    <Button variant="outline-info" className="w-100">
                                        💬 WhatsApp
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contacts;