import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

const $host = axios.create({
    baseURL: API_BASE
})

const $authHost = axios.create({
    baseURL: API_BASE
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

// Обработка ошибок браузерных расширений
$host.interceptors.response.use(
    response => response,
    error => {
        // Игнорируем ошибки браузерных расширений
        if (error.message && (
            error.message.includes('Invalid property descriptor') ||
            error.message.includes('Cannot redefine property') ||
            error.message.includes('ethereum')
        )) {
            console.warn('Browser extension network error ignored:', error.message);
            return Promise.resolve({ data: [] }); // Возвращаем пустой ответ
        }
        return Promise.reject(error);
    }
);

$authHost.interceptors.response.use(
    response => response,
    error => {
        // Игнорируем ошибки браузерных расширений
        if (error.message && (
            error.message.includes('Invalid property descriptor') ||
            error.message.includes('Cannot redefine property') ||
            error.message.includes('ethereum')
        )) {
            console.warn('Browser extension network error ignored:', error.message);
            return Promise.resolve({ data: [] }); // Возвращаем пустой ответ
        }
        return Promise.reject(error);
    }
);

export {
    $host,
    $authHost
}
