import React, {useState, useContext} from 'react';
import {Container, Row, Col, Card, Button, Form, Modal, Alert} from "react-bootstrap";
import {Context} from "../index";
import {changePassword, deleteAccount} from "../http/userAPI";
import {useHistory} from 'react-router-dom';
import {LOGIN_ROUTE} from '../utils/consts';

const ProfileSettings = () => {
    const {user} = useContext(Context);
    const history = useHistory();

    // Состояния для изменения пароля
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Состояния для удаления аккаунта
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Заповніть всі поля');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Новий пароль та підтвердження не співпадають');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Новий пароль має містити мінімум 6 символів');
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordSuccess('Пароль успішно змінено!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Помилка при зміні пароля');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setDeleteError('Введіть пароль для підтвердження');
            return;
        }

        setDeleteLoading(true);
        try {
            await deleteAccount(deletePassword);
            // Выход из системы
            localStorage.removeItem('token');
            user.setUser({});
            user.setIsAuth(false);
            user.setRole('USER');
            history.push(LOGIN_ROUTE);
            alert('Аккаунт успішно видалено');
        } catch (error) {
            setDeleteError(error.response?.data?.message || 'Помилка при видаленні аккаунта');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleShowDeleteModal = () => {
        setDeletePassword('');
        setDeleteError('');
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletePassword('');
        setDeleteError('');
    };

    return (
        <Container style={{paddingTop: '50px', paddingBottom: '50px'}}>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <h1 className="mb-4 text-center">Налаштування профілю</h1>

                    {/* Информация о пользователе */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Інформація про профіль</h4>
                            <Row>
                                <Col sm={6}>
                                    <p><strong>Email:</strong> {user.user?.email}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Роль:</strong> {user.user?.role}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Изменение пароля */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Зміна пароля</h4>

                            {passwordError && (
                                <Alert variant="danger" className="mb-3">
                                    {passwordError}
                                </Alert>
                            )}

                            {passwordSuccess && (
                                <Alert variant="success" className="mb-3">
                                    {passwordSuccess}
                                </Alert>
                            )}

                            <Form onSubmit={handleChangePassword}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Поточний пароль</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Введіть поточний пароль"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Новий пароль</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Введіть новий пароль"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Підтвердження нового пароля</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Повторіть новий пароль"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? 'Змінюємо...' : 'Змінити пароль'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Удаление аккаунта */}
                    <Card className="border-danger shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3 text-danger">Видалення аккаунта</h4>
                            <p className="text-muted mb-3">
                                <strong>Увага!</strong> Цю дію неможливо скасувати.
                                Всі ваші дані будуть видалені назавжди.
                            </p>

                            <Alert variant="warning">
                                <strong>Що буде видалено:</strong>
                                <ul className="mb-0 mt-2">
                                    <li>Ваш профіль та всі особисті дані</li>
                                    <li>Всі оголошення нерухомості</li>
                                    <li>Історія угод та повідомлень</li>
                                </ul>
                            </Alert>

                            <Button
                                variant="outline-danger"
                                onClick={handleShowDeleteModal}
                                className="mt-3"
                            >
                                Видалити аккаунт
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Модальное окно для удаления аккаунта */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton closeVariant="dark">
                    <Modal.Title className="text-danger">Підтвердження видалення аккаунта</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        <strong>Це остання можливість скасувати дію!</strong>
                        <br />
                        Після видалення аккаунта відновити дані буде неможливо.
                    </Alert>

                    <Form.Group className="mb-3">
                        <Form.Label>Введіть ваш пароль для підтвердження:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ваш пароль"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            isInvalid={!!deleteError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {deleteError}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Скасувати
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Видаляємо...' : 'Видалити аккаунт назавжди'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProfileSettings;