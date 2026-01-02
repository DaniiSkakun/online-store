import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink} from "react-router-dom";
import {ADMIN_ROUTE, SELLER_ROUTE, FAVORITES_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, PROFILE_SETTINGS_ROUTE} from "../utils/consts";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import {useHistory} from 'react-router-dom'
import {$host} from "../http";
const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()
    const [dbInfo, setDbInfo] = useState(null)

    useEffect(() => {
        $host.get('api/health/db')
            .then(({data}) => setDbInfo(data))
            .catch(() => setDbInfo(null))
    }, [])

    const logOut = () => {
        localStorage.removeItem('token') // Очищаем токен из localStorage
        user.setUser({})
        user.setIsAuth(false)
        user.setRole('USER') // Устанавливаем роль USER при выходе
        console.log('👋 Пользователь вышел из системы')
    }

    return (
        <Navbar bg="dark" variant="dark" style={{minHeight: '80px', padding: '20px 0'}}>
            <Container className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center flex-wrap gap-2">
                    <span
                        style={{color:'white', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 900, whiteSpace: 'nowrap'}}
                        onClick={() => {
                            history.push(SHOP_ROUTE);
                            window.location.reload();
                        }}
                    >
                        Нерухомість Україна
                    </span>
                    {dbInfo && (
                        <span style={{color: '#adb5bd', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                            Дані з: {dbInfo.dialect}{dbInfo.database ? ` (${dbInfo.database})` : ''} · оголошень: {dbInfo.counts?.properties ?? '—'}
                        </span>
                    )}
                </div>
                {user.isAuth ?
                    <Nav className="ms-auto d-flex align-items-center flex-wrap" style={{color: 'white'}}>
                        {user.role === 'ADMIN' &&
                            <Button
                                variant={"dark"}
                                onClick={() => history.push(ADMIN_ROUTE)}
                                className="me-2 px-3 py-2"
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: 'white',
                                    borderColor: '#dee2e6',
                                    color: 'black'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.borderColor = '#adb5bd';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.borderColor = '#dee2e6';
                                }}
                            >
                                Адмін панель
                            </Button>
                        }
                        <Button
                            variant={"dark"}
                            onClick={() => {
                                if (user.isAuth) {
                                    history.push(FAVORITES_ROUTE);
                                } else {
                                    alert('Для перегляду обраного потрібно увійти в систему або зареєструватися.');
                                    history.push(LOGIN_ROUTE);
                                }
                            }}
                            className="ms-2 me-2 px-3 py-2"
                            style={{
                                marginRight: '10px',
                                backgroundColor: 'white',
                                borderColor: '#dee2e6',
                                color: 'black'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#adb5bd';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.borderColor = '#dee2e6';
                            }}
                        >
                            <span style={{color: '#2f343a', fontSize: '1.4rem', marginRight: '4px'}}>★</span> Обране
                        </Button>
                        {user.role === 'SELLER' &&
                            <Button
                                variant={"dark"}
                                onClick={() => history.push(SELLER_ROUTE)}
                                className="ms-2 me-2 px-3 py-2"
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: 'white',
                                    borderColor: '#dee2e6',
                                    color: 'black'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.borderColor = '#adb5bd';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.borderColor = '#dee2e6';
                                }}
                            >
                                Панель продавця
                            </Button>
                        }
                        <Button
                            variant={"dark"}
                            onClick={() => history.push(PROFILE_SETTINGS_ROUTE)}
                            className="me-2 px-3 py-2"
                            style={{
                                marginRight: '10px',
                                backgroundColor: 'white',
                                borderColor: '#dee2e6',
                                color: 'black'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#adb5bd';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.borderColor = '#dee2e6';
                            }}
                        >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                            </svg>
                            Налаштування
                        </Button>
                        <Button
                            variant={"danger"}
                            onClick={() => logOut()}
                            className="ml-2 ms-2"
                        >
                            Вийти
                        </Button>
                    </Nav>
                    :
                    <Nav className="ms-auto d-flex align-items-center gap-2" style={{color: 'white'}}>
                        <Button
                            variant={"success"}
                            size="lg"
                            onClick={() => history.push(LOGIN_ROUTE)}
                            className="me-5"
                            style={{fontSize: '1.1rem', padding: '10px 20px', marginRight: '30px'}}
                        >
                            Увійти
                        </Button>
                        <Button
                            variant={"outline-light"}
                            size="lg"
                            onClick={() => history.push(REGISTRATION_ROUTE)}
                            style={{fontSize: '1.1rem', padding: '10px 20px'}}
                        >
                            Реєстрація
                        </Button>
                    </Nav>
                }
            </Container>
        </Navbar>

    );
});

export default NavBar;
