import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._role = 'USER' // Добавлено поле для роли с дефолтным USER
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
        // Также обновляем роль, если она есть в объекте пользователя
        if (user && user.role) {
            this._role = user.role;
        } else {
            this._role = 'USER'; // По умолчанию, если нет роли или пользователь разлогинился
        }
    }
    // Метод для явной установки роли (может быть полезен при выходе)
    setRole(role) {
        this._role = role;
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get role() { // Геттер для получения роли
        return this._role
    }
}