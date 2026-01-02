import {makeAutoObservable} from "mobx";

export default class PropertyStore {
    constructor() {
        this._propertyTypes = []
        this._districts = []
        this._cities = [] // Города
        this._properties = []
        this._favorites = [] // Избранные объекты
        this._selectedPropertyType = null // Одиночный выбранный тип для создания
        this._selectedDistrict = null // Одиночный выбранный район для создания
        this._selectedCity = null // Одиночный выбранный город для создания
        this._selectedPropertyTypes = [] // Массив выбранных типов
        this._selectedDistricts = [] // Массив выбранных районов
        this._selectedCities = [] // Массив выбранных городов
        this._searchQuery = '' // Глобальный поиск
        this._sortBy = '' // Поле сортировки (price, area, createdAt)
        this._sortOrder = 'asc' // Порядок сортировки (asc, desc)
        this._page = 1
        this._totalCount = 0
        this._limit = 9
        makeAutoObservable(this)
    }

    setPropertyTypes(propertyTypes) {
        this._propertyTypes = propertyTypes
    }
    setDistricts(districts) {
        this._districts = districts
    }
    setCities(cities) {
        this._cities = cities
    }
    setProperties(properties) {
        this._properties = properties
    }

    setFavorites(favorites) {
        this._favorites = favorites
    }

    addToFavorites(favorite) {
        this._favorites.push(favorite)
    }

    removeFromFavorites(propertyId) {
        // Создаем новый массив для правильного отслеживания изменений MobX
        this._favorites = this._favorites.filter(f => f.propertyId !== propertyId)
    }

    addToFavoritesLocally(property) {
        // Добавляем в начало списка для мгновенного отображения
        const newFavorite = {
            id: Date.now(), // временный ID
            propertyId: property.id,
            property: property
        };
        // Создаем новый массив для правильного отслеживания изменений MobX
        this._favorites = [newFavorite, ...this._favorites];
    }

    isInFavorites(propertyId) {
        return this._favorites.some(f => f.propertyId === propertyId)
    }

    // Работа с одиночными значениями для создания недвижимости
    setSelectedPropertyType(propertyType) {
        console.log('🔄 setSelectedPropertyType вызван с:', propertyType?.name)
        this._selectedPropertyType = propertyType
        console.log('📍 Текущий selectedPropertyType:', this._selectedPropertyType?.name)
    }

    setSelectedPropertyTypes(propertyTypes) {
        this.setPage(1)
        this._selectedPropertyTypes = propertyTypes
    }

    togglePropertyType(propertyType) {
        this.setPage(1)
        const index = this._selectedPropertyTypes.findIndex(type => type.id === propertyType.id)
        if (index > -1) {
            this._selectedPropertyTypes.splice(index, 1)
            console.log('❌ Убрали тип:', propertyType.name)
        } else {
            this._selectedPropertyTypes.push(propertyType)
            console.log('✅ Добавили тип:', propertyType.name)
        }
        console.log('📋 Текущие типы:', this._selectedPropertyTypes.map(t => t.name))
    }

    clearPropertyTypes() {
        this.setPage(1)
        this._selectedPropertyTypes = []
    }

    // Работа с массивами районов
    setSelectedDistrict(district) {
        console.log('🔄 setSelectedDistrict вызван с:', district?.name)
        this._selectedDistrict = district
        console.log('🏙️ Текущий selectedDistrict:', this._selectedDistrict?.name)
    }

    setSelectedCity(city) {
        console.log('🏙️ setSelectedCity вызван с:', city?.name)
        this._selectedCity = city
        console.log('🏙️ Текущий selectedCity:', this._selectedCity?.name)
    }

    // Очистка одиночных значений для создания
    clearSelectedPropertyType() {
        console.log('🧹 Очищаем selectedPropertyType')
        this._selectedPropertyType = null
    }

    clearSelectedDistrict() {
        console.log('🧹 Очищаем selectedDistrict')
        this._selectedDistrict = null
    }

    setSelectedDistricts(districts) {
        this.setPage(1)
        this._selectedDistricts = districts
    }

    toggleDistrict(district) {
        this.setPage(1)
        const index = this._selectedDistricts.findIndex(d => d.id === district.id)
        if (index > -1) {
            this._selectedDistricts.splice(index, 1)
            console.log('❌ Убрали район:', district.name)
        } else {
            this._selectedDistricts.push(district)
            console.log('✅ Добавили район:', district.name)
        }
        console.log('🏙️ Текущие районы:', this._selectedDistricts.map(d => d.name))
    }

    clearDistricts() {
        this.setPage(1)
        this._selectedDistricts = []
    }

    // Работа с массивами городов
    toggleCity(city) {
        this.setPage(1)
        const index = this._selectedCities.findIndex(c => c.id === city.id)
        if (index > -1) {
            this._selectedCities.splice(index, 1)
            console.log('❌ Убрали город:', city.name)
        } else {
            this._selectedCities.push(city)
            console.log('✅ Добавили город:', city.name)
        }
        console.log('🏙️ Текущие города:', this._selectedCities.map(c => c.name))
    }

    clearCities() {
        this.setPage(1)
        this._selectedCities = []
    }

    setSelectedCities(cities) {
        this.setPage(1)
        this._selectedCities = cities
    }

    // Глобальный поиск
    setSearchQuery(query) {
        this.setPage(1)
        this._searchQuery = query
    }

    clearSearch() {
        this.setPage(1)
        this._searchQuery = ''
    }

    // Сортировка
    setSorting(sortBy, sortOrder = 'asc') {
        this.setPage(1)
        this._sortBy = sortBy
        this._sortOrder = sortOrder
    }

    toggleSortOrder() {
        this._sortOrder = this._sortOrder === 'asc' ? 'desc' : 'asc'
    }

    clearSorting() {
        this.setPage(1)
        this._sortBy = ''
        this._sortOrder = 'asc'
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get propertyTypes() {
        return this._propertyTypes
    }
    get districts() {
        return this._districts
    }
    get cities() {
        return this._cities
    }
    get properties() {
        return this._properties
    }

    get favorites() {
        return this._favorites
    }
    get selectedPropertyType() {
        return this._selectedPropertyType
    }
    get selectedDistrict() {
        return this._selectedDistrict
    }
    get selectedCity() {
        return this._selectedCity
    }
    get selectedPropertyTypes() {
        return this._selectedPropertyTypes
    }
    get selectedDistricts() {
        return this._selectedDistricts
    }
    get selectedCities() {
        return this._selectedCities
    }
    get searchQuery() {
        return this._searchQuery
    }
    get sortBy() {
        return this._sortBy
    }
    get sortOrder() {
        return this._sortOrder
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}


