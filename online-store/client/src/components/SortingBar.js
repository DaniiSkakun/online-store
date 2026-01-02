import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Form, Button} from "react-bootstrap";

const SortingBar = observer(() => {
    const {property} = useContext(Context)

    const handleSortChange = (sortBy) => {
        if (property.sortBy === sortBy) {
            // Если уже сортируем по этому полю, меняем порядок
            property.toggleSortOrder()
        } else {
            // Если новое поле, устанавливаем сортировку по возрастанию
            property.setSorting(sortBy, 'asc')
        }
    }

    const getSortIcon = (field) => {
        if (property.sortBy !== field) return '↕️'
        return property.sortOrder === 'asc' ? '⬆️' : '⬇️'
    }

    const getSortText = (field) => {
        if (property.sortBy !== field) return ''
        return property.sortOrder === 'asc' ? ' (за зростанням)' : ' (за спаданням)'
    }

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center gap-5">
                <span className="fw-bold" style={{marginRight: '2rem'}}>Сортування:</span>

                <Button
                    variant={property.sortBy === 'price' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSortChange('price')}
                    style={{marginRight: '1rem'}}
                >
                    {getSortIcon('price')} Ціні {getSortText('price')}
                </Button>

                <Button
                    variant={property.sortBy === 'area' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSortChange('area')}
                    style={{marginRight: '1rem'}}
                >
                    {getSortIcon('area')} Площі {getSortText('area')}
                </Button>

                <Button
                    variant={property.sortBy === 'createdAt' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleSortChange('createdAt')}
                    style={{marginRight: '1rem'}}
                >
                    {getSortIcon('createdAt')} Даті {getSortText('createdAt')}
                </Button>

                {property.sortBy && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => property.clearSorting()}
                        style={{color: 'white'}}
                    >
                        Скинути
                    </Button>
                )}
            </div>
        </div>
    );
});

export default SortingBar;
