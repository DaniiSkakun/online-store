import {$authHost} from "./index";

export const addToFavorite = async (propertyId) => {
    const {data} = await $authHost.post('api/favorite/', {propertyId})
    return data
}

export const removeFromFavorite = async (propertyId) => {
    const {data} = await $authHost.delete(`api/favorite/${propertyId}`)
    return data
}

export const getUserFavorites = async () => {
    const {data} = await $authHost.get('api/favorite/')
    return data
}

export const checkFavorite = async (propertyId) => {
    const {data} = await $authHost.get(`api/favorite/check/${propertyId}`)
    return data
}
