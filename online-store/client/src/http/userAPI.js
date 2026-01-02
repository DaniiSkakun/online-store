import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password, role = 'BUYER') => {
    const {data} = await $host.post('api/user/registration', {email, password, role})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const requestPasswordReset = async (email) => {
    const {data} = await $host.post('api/user/request-password-reset', {email})
    return data
}

export const verifyResetCode = async (email, code) => {
    const {data} = await $host.post('api/user/verify-reset-code', {email, code})
    return data
}

export const resetPassword = async (email, code, newPassword) => {
    const {data} = await $host.post('api/user/reset-password', {email, code, newPassword})
    return data
}

export const changePassword = async (currentPassword, newPassword) => {
    const {data} = await $authHost.put('api/user/change-password', {currentPassword, newPassword})
    return data
}

export const deleteAccount = async (password) => {
    const {data} = await $authHost.delete('api/user/delete-account', {data: {password}})
    return data
}