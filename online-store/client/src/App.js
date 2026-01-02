import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BrowserExtensionGuard from "./components/BrowserExtensionGuard";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {getUserFavorites} from "./http/favoriteAPI";
import {Spinner} from "react-bootstrap";

// Дополнительная защита от ошибок браузерных расширений на уровне приложения
if (typeof window !== 'undefined') {
    // Перехватываем и подавляем ошибки ethereum
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ').toLowerCase();
        if (message.includes('cannot redefine property: ethereum') ||
            message.includes('invalid property descriptor') ||
            message.includes('chrome-extension://') ||
            message.includes('moz-extension://')) {
            return; // Полностью подавляем
        }
        return originalError.apply(this, args);
    };

    // Защищаем window.ethereum от переопределения
    if (!window.ethereum) {
        try {
            Object.defineProperty(window, 'ethereum', {
                value: undefined,
                writable: false,
                configurable: false
            });
        } catch (e) {
            // Игнорируем ошибки
        }
    }
}

const App = observer(() => {
    const {user, property} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            check().then(async (data) => {
                user.setUser(data)
                user.setIsAuth(true)
                console.log('✅ Пользователь авторизован:', data.email, 'роль:', data.role)

                // Загружаем избранное пользователя
                try {
                    const favorites = await getUserFavorites()
                    property.setFavorites(favorites)
                    console.log('⭐ Загружено избранное:', favorites.length, 'объектов')
                } catch (favError) {
                    console.error('❌ Помилка завантаження обраного:', favError)
                }
            }).catch(error => {
                console.log('❌ Токен недействительный, пользователь разлогинен')
                localStorage.removeItem('token')
                user.setUser({})
                user.setIsAuth(false)
                user.setRole('USER')
            }).finally(() => setLoading(false))
        } else {
            console.log('ℹ️ Токен отсутствует, пользователь не авторизован')
            setLoading(false)
        }
    }, [])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <BrowserRouter>
            <BrowserExtensionGuard>
                <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
                    <NavBar />
                    <div style={{marginTop: '16px', flex: '1'}}>
                        <AppRouter />
                    </div>
                    <Footer style={{marginTop: '80px'}} />
                </div>
            </BrowserExtensionGuard>
        </BrowserRouter>
    );
});

export default App;
