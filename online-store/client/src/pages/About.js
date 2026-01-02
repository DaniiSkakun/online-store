import React from 'react';
import {Container, Row, Col, Card} from "react-bootstrap";

const About = () => {
    return (
        <Container style={{paddingTop: '50px', paddingBottom: '50px'}}>
            <h1 className="mb-4 text-center">Про нас</h1>

            <Row className="mb-5">
                <Col lg={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <div className="mb-4" style={{display: 'flex', alignItems: 'center'}}>
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: 'black',
                                        borderRadius: '6px',
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
                                <h3 style={{color: 'black', margin: 0}}>Нерухомість Україна</h3>
                            </div>

                            <p className="lead mb-4">
                                Ми - провідна компанія з нерухомості в Україні, яка допомагає людям знаходити
                                ідеальний дім або квартиру для життя, інвестицій або бізнесу.
                            </p>

                            <h4 className="mb-3">Наша місія</h4>
                            <p className="mb-4">
                                Забезпечити кожного клієнта професійними послугами з нерухомості,
                                зробивши процес купівлі, продажу або оренди максимально простим і прозорим.
                            </p>

                            <h4 className="mb-3">Наші цінності</h4>
                            <ul className="list-unstyled">
                                <li className="mb-2">✅ <strong>Довіра</strong> - прозорі та чесні відносини з клієнтами</li>
                                <li className="mb-2">✅ <strong>Професіоналізм</strong> - команда експертів з багаторічним досвідом</li>
                                <li className="mb-2">✅ <strong>Індивідуальний підхід</strong> - персональні рішення для кожного</li>
                                <li className="mb-2">✅ <strong>Інновації</strong> - використання сучасних технологій</li>
                            </ul>

                            <h4 className="mb-3">Чому обирають нас</h4>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="bg-light p-3 rounded">
                                        <h5 className="text-success">📊 Широка база</h5>
                                        <p className="mb-0">Тисячі варіантів нерухомості по всій Україні</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="bg-light p-3 rounded">
                                        <h5 className="text-success">💰 Кращі ціни</h5>
                                        <p className="mb-0">Прямі власники та вигідні умови співпраці</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="bg-light p-3 rounded">
                                        <h5 className="text-success">🔒 Гарантія</h5>
                                        <p className="mb-0">Юридичний супровід та перевірка документів</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="bg-light p-3 rounded">
                                        <h5 className="text-success">📞 Підтримка 24/7</h5>
                                        <p className="mb-0">Завжди на зв'язку для консультацій</p>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={10} className="mx-auto">
                    <Card className="bg-primary text-white">
                        <Card.Body className="text-center p-4">
                            <h4 className="mb-3">Готові почати пошук нерухомості?</h4>
                            <p className="mb-0">
                                Зв'яжіться з нами сьогодні та отримайте безкоштовну консультацію!
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;