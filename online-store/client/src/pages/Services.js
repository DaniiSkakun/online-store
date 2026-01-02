import React from 'react';
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {SHOP_ROUTE} from '../utils/consts';

const Services = () => {
    const history = useHistory();

    return (
        <Container style={{paddingTop: '50px', paddingBottom: '50px'}}>
            <h1 className="mb-4 text-center">Наші послуги</h1>

            <Row className="mb-5">
                <Col lg={10} className="mx-auto">
                    <p className="lead text-center mb-5">
                        Повний спектр послуг з нерухомості для задоволення всіх ваших потреб
                    </p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-primary">
                        <Card.Body className="d-flex flex-column text-center p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>🏠</span>
                            </div>
                            <h4 className="card-title text-primary mb-3">Продаж нерухомості</h4>
                            <p className="card-text flex-grow-1">
                                Професійний супровід продажу квартир, будинків, комерційної нерухомості.
                                Маркетинг, покази, юридичний супровід та допомога з документами.
                            </p>
                            <ul className="list-unstyled text-start mb-3">
                                <li>✅ Реклама на всіх платформах</li>
                                <li>✅ Професійні фото та відео</li>
                                <li>✅ Юридична перевірка</li>
                                <li>✅ Підготовка документів</li>
                            </ul>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => history.push(SHOP_ROUTE)}
                                className="mt-auto"
                            >
                                Переглянути об'єкти
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-success">
                        <Card.Body className="d-flex flex-column text-center p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>🔑</span>
                            </div>
                            <h4 className="card-title text-success mb-3">Оренда житла</h4>
                            <p className="card-text flex-grow-1">
                                Широка база орендної нерухомості: квартири, будинки, кімнати.
                                Допомога з укладанням договорів та перевірка орендарів.
                            </p>
                            <ul className="list-unstyled text-start mb-3">
                                <li>✅ Квартири від 1 до 5 кімнат</li>
                                <li>✅ Будинки та котеджі</li>
                                <li>✅ Комерційна нерухомість</li>
                                <li>✅ Без комісії для орендарів</li>
                            </ul>
                            <Button
                                variant="success"
                                size="lg"
                                onClick={() => history.push(SHOP_ROUTE)}
                                className="mt-auto"
                            >
                                Знайти житло
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-info">
                        <Card.Body className="d-flex flex-column text-center p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>💼</span>
                            </div>
                            <h4 className="card-title text-info mb-3">Консультації</h4>
                            <p className="card-text flex-grow-1">
                                Безкоштовні консультації з питань нерухомості. Допомога у виборі району,
                                аналіз ринку, поради щодо інвестицій.
                            </p>
                            <ul className="list-unstyled text-start mb-3">
                                <li>✅ Аналіз ринку нерухомості</li>
                                <li>✅ Поради щодо інвестицій</li>
                                <li>✅ Вибір оптимального району</li>
                                <li>✅ Оцінювання вартості</li>
                            </ul>
                            <Button
                                variant="info"
                                size="lg"
                                onClick={() => history.push('/contacts')}
                                className="mt-auto"
                            >
                                Отримати консультацію
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-warning">
                        <Card.Body className="d-flex flex-column text-center p-4">
                            <div className="mb-3">
                                <span style={{fontSize: '3rem'}}>💰</span>
                            </div>
                            <h4 className="card-title text-warning mb-3">Оцінка майна</h4>
                            <p className="card-text flex-grow-1">
                                Професійна оцінка вартості нерухомості для продажу, оренди,
                                кредитування, страхування та юридичних потреб.
                            </p>
                            <ul className="list-unstyled text-start mb-3">
                                <li>✅ Ринкова вартість</li>
                                <li>✅ Оцінка для банку</li>
                                <li>✅ Страхова оцінка</li>
                                <li>✅ Судова експертиза</li>
                            </ul>
                            <Button
                                variant="warning"
                                size="lg"
                                onClick={() => history.push('/contacts')}
                                className="mt-auto"
                            >
                                Замовити оцінку
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8} className="mx-auto">
                    <Card className="bg-light">
                        <Card.Body className="text-center p-4">
                            <h4 className="mb-3">Потрібна допомога?</h4>
                            <p className="mb-3">
                                Наші експерти готові допомогти вам з будь-яким питанням щодо нерухомості.
                                Зв'яжіться з нами для отримання безкоштовної консультації.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => history.push('/contacts')}
                            >
                                Зв'язатися з нами
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Services;