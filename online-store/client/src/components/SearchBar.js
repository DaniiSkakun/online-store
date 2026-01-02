import React, {useContext, useCallback, useRef} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Form, InputGroup, Button} from "react-bootstrap";

// Простая реализация debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const SearchBar = observer(() => {
    const {property} = useContext(Context)

    // Debounced функция для поиска - выполняется через 500ms после последнего ввода
    const debouncedSearch = useCallback(
        debounce((query) => {
            console.log('🔍 Автопоиск:', query)
            property.setSearchQuery(query)
        }, 500),
        [property]
    )

    const handleInputChange = (e) => {
        const query = e.target.value
        if (query.trim() === '') {
            // Если поле пустое, очищаем поиск сразу
            property.clearSearch()
        } else {
            // Иначе используем debounced поиск
            debouncedSearch(query)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        console.log('🔍 Ручной поиск:', property.searchQuery)
        // Ручной поиск можно оставить как есть
    }

    const handleClear = () => {
        console.log('🧹 Очищен поиск')
        property.clearSearch()
    }

    return (
        <Form onSubmit={handleSearch} className="mb-3 mt-4">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Пошук за назвою або адресою..."
                    defaultValue={property.searchQuery}
                    onChange={handleInputChange}
                />
                {property.searchQuery && (
                    <Button
                        variant="danger"
                        onClick={handleClear}
                        style={{color: 'white'}}
                    >
                        ✕
                    </Button>
                )}
                <Button variant="outline-primary" type="submit">
                    🔍 Пошук
                </Button>
            </InputGroup>
        </Form>
    );
});

export default SearchBar;
