import React, {useContext, useState} from 'react';
import {Container, Form, Modal} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useHistory} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts";
import {login, registration, requestPasswordReset, verifyResetCode, resetPassword} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useHistory()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER') // Добавлено состояние для роли
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [resetStep, setResetStep] = useState(1) // 1 - email, 2 - code, 3 - new password

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const click = async () => {
        try {
            // Валидация email
            if (!email.trim()) {
                alert('Будь ласка, введіть email адресу');
                return;
            }

            if (!validateEmail(email)) {
                alert('Будь ласка, введіть коректну email адресу. На цю пошту будуть приходити важливі повідомлення.');
                return;
            }

            if (!isLogin && !password.trim()) {
                alert('Будь ласка, введіть пароль');
                return;
            }

            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                // Передаем выбранную роль при регистрации
                data = await registration(email, password, role);
            }
            user.setUser(data) // Обновлено, чтобы сохранять данные пользователя, включая роль
            user.setIsAuth(true)
            history.push(SHOP_ROUTE)
        } catch (e) {
            alert(e.response?.data?.message || 'Сталася помилка при авторизації. Перевірте підключення до інтернету та спробуйте ще раз.')
        }
    }

    const handleForgotPassword = async () => {
        try {
            const targetEmail = (email || '').trim();
            setResetEmail(targetEmail);

            if (!targetEmail) {
                alert('Будь ласка, введіть email адресу');
                return;
            }

            if (!validateEmail(targetEmail)) {
                alert('Будь ласка, введіть коректну email адресу');
                return;
            }

            await requestPasswordReset(targetEmail);
            // Уведомление убрано по просьбе пользователя
            setResetStep(2);
        } catch (e) {
            alert(e.response?.data?.message || 'Сталася помилка при відправці коду відновлення');
        }
    }

    const handleVerifyCode = async () => {
        try {
            if (!resetCode.trim()) {
                alert('Будь ласка, введіть код відновлення');
                return;
            }

            await verifyResetCode(resetEmail, resetCode);
            // Уведомление убрано по просьбе пользователя
            setResetStep(3);
        } catch (e) {
            alert(e.response?.data?.message || 'Невірний код відновлення');
        }
    }

    const handleResetPassword = async () => {
        try {
            if (!newPassword.trim()) {
                alert('Будь ласка, введіть новий пароль');
                return;
            }

            if (newPassword.length < 6) {
                alert('Пароль має містити не менше 6 символів');
                return;
            }

            await resetPassword(resetEmail, resetCode, newPassword);
            // Уведомление убрано по просьбе пользователя
            setShowForgotPassword(false);
            setResetStep(1);
            setResetEmail('');
            setResetCode('');
            setNewPassword('');
        } catch (e) {
            alert(e.response?.data?.message || 'Сталася помилка при зміні пароля');
        }
    }

    const closeForgotPasswordModal = () => {
        setShowForgotPassword(false);
        setResetStep(1);
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизація' : "Реєстрація"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введіть ваш email (реальна пошта для повідомлень)..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введіть ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {!isLogin && (
                        <div className="mt-3">
                            <Form.Check
                                inline
                                type="radio"
                                label="Покупець"
                                name="userRole"
                                id="roleBuyer"
                                value="USER"
                                checked={role === 'USER'}
                                onChange={() => setRole('USER')}
                                className="me-3"
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="Продавець"
                                name="userRole"
                                id="roleSeller"
                                value="SELLER"
                                checked={role === 'SELLER'}
                                onChange={() => setRole('SELLER')}
                                className="me-3"
                            />
                        </div>
                    )}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div className="d-flex flex-column">
                                <div>
                                    Немає аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зареєструйся!</NavLink>
                                </div>
                                <div className="mt-2">
                                    <Button
                                        variant="link"
                                        className="p-0 text-decoration-none"
                                        onClick={() => setShowForgotPassword(true)}
                                        style={{fontSize: '0.9rem'}}
                                    >
                                        Забули пароль?
                                    </Button>
                                </div>
                            </div>
                            :
                            <div>
                                Є аккаунт? <NavLink to={LOGIN_ROUTE}>Увійдіть!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Увійти' : 'Реєстрація'}
                        </Button>
                    </Row>
                </Form>
            </Card>

            {/* Modal window for password recovery */}
            <Modal show={showForgotPassword} onHide={closeForgotPasswordModal}>
                <Modal.Header closeButton closeVariant="dark">
                    <Modal.Title>Відновлення пароля</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resetStep === 1 && (
                        <div>
                            <p>Код буде надіслано на email вашого акаунта: <strong>{email || '—'}</strong></p>
                        </div>
                    )}

                    {resetStep === 2 && (
                        <div>
                            <p>Введіть код відновлення, надісланий на {resetEmail}:</p>
                            <Form.Control
                                type="text"
                                placeholder="Введіть код відновлення..."
                                value={resetCode}
                                onChange={e => setResetCode(e.target.value)}
                                className="mb-3"
                            />
                        </div>
                    )}

                    {resetStep === 3 && (
                        <div>
                            <p>Введіть новий пароль:</p>
                            <Form.Control
                                type="password"
                                placeholder="Новий пароль (мінімум 6 символів)..."
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="mb-3"
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeForgotPasswordModal}>
                        Скасувати
                    </Button>
                    {resetStep === 1 && (
                        <Button variant="primary" onClick={handleForgotPassword}>
                            Надіслати код
                        </Button>
                    )}
                    {resetStep === 2 && (
                        <Button variant="primary" onClick={handleVerifyCode}>
                            Підтвердити код
                        </Button>
                    )}
                    {resetStep === 3 && (
                        <Button variant="primary" onClick={handleResetPassword}>
                            Змінити пароль
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default Auth;