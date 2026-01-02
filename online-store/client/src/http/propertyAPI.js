import {$authHost, $host} from "./index";

export const createPropertyType = async (propertyType) => {
    const {data} = await $authHost.post('api/property-type', propertyType)
    return data
}

export const createCity = async (city) => {
    const {data} = await $authHost.post('api/city', city)
    return data
}

export const deletePropertyType = async (id) => {
    const {data} = await $authHost.delete(`api/property-type/${id}`)
    return data
}

export const fetchPropertyTypes = async () => {
    const {data} = await $host.get('api/property-type')
    return data
}

export const createDistrict = async (district) => {
    const {data} = await $authHost.post('api/district', district)
    return data
}

export const deleteDistrict = async (id) => {
    const {data} = await $authHost.delete(`api/district/${id}`)
    return data
}

export const fetchDistricts = async () => {
    const {data} = await $host.get('api/district')
    return data
}

export const fetchCities = async () => {
    const {data} = await $host.get('api/city')
    return data
}

export const deleteCity = async (id) => {
    const {data} = await $authHost.delete(`api/city/${id}`)
    return data
}

export const createProperty = async (property) => {
    const {data} = await $authHost.post('api/property', property)
    return data
}

export const updateProperty = async (id, property) => {
    const {data} = await $authHost.put(`api/property/${id}`, property)
    return data
}

export const fetchProperties = async (propertyTypeIds, districtIds, cityIds, searchQuery, page, limit = 9, sortBy, sortOrder) => {
    const params = { page, limit }

    if (propertyTypeIds && propertyTypeIds.length > 0) {
        params.propertyTypeIds = propertyTypeIds.map(type => type.id).join(',')
    }

    if (districtIds && districtIds.length > 0) {
        params.districtIds = districtIds.map(district => district.id).join(',')
    }

    if (cityIds && cityIds.length > 0) {
        params.cityIds = cityIds.map(city => city.id).join(',')
    }

    if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim()
    }

    if (sortBy) {
        params.sortBy = sortBy
        params.sortOrder = sortOrder || 'asc'
    }

    const {data} = await $host.get('api/property', {params})
    return data
}

export const fetchOneProperty = async (id) => {
    const {data} = await $host.get('api/property/' + id)
    return data
}

export const contactSeller = async (propertyId, payload) => {
    const {data} = await $host.post(`api/property/${propertyId}/contact`, payload)
    return data
}

export const fetchUserProperties = async () => {
    const {data} = await $authHost.get('api/property/user')
    return data
}

export const deleteProperty = async (id) => {
    const {data} = await $authHost.delete('api/property/' + id)
    return data
}
