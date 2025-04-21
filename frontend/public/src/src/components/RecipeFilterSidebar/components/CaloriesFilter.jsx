// Файл components/RecipeFilterSidebar/components/CaloriesFilter.jsx:
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Input from '../../_common/Input/Input';
import Button from '../../_common/Button/Button';

const CaloriesFilter = ({ minCalories, maxCalories, onChange, showOkButton = false }) => {
    const [tempMin, setTempMin] = useState(minCalories);
    const [tempMax, setTempMax] = useState(maxCalories);

    // Проверка, заполнен ли хотя бы один из инпутов
    const isAtLeastOneInputFilled = tempMin !== '' || tempMax !== '';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? '' : Number(value);

        if (name === 'min_calories') {
            setTempMin(numValue);
        } else {
            setTempMax(numValue);
        }

        // Если кнопка OK не используется, применяем фильтры сразу
        if (!showOkButton) {
            onChange(name, numValue);
        }
    };

    const handleApply = () => {
        onChange('min_calories', tempMin);
        onChange('max_calories', tempMax);
    };

    return (
        <div className="filter-section">
            <Row className="calories-inputs">
                <Col>
                    <Input
                        type="number"
                        name="min_calories"
                        placeholder="100"
                        value={showOkButton ? tempMin : minCalories}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col xs="auto" className="px-0 d-flex align-items-center">
                    <span>-</span>
                </Col>
                <Col>
                    <Input
                        type="number"
                        name="max_calories"
                        placeholder="500"
                        value={showOkButton ? tempMax : maxCalories}
                        onChange={handleInputChange}
                    />
                </Col>
                {showOkButton && (
                    <Col xs="auto">
                        <Button
                            text="Ок" // Текст на кнопке
                            onClick={handleApply} // Обработчик клика
                            variant="default" // Вариант стиля кнопки
                            type="button" // Тип кнопки
                            className="mt-2" // Дополнительные классы
                            isActive={isAtLeastOneInputFilled} // Активна, если хотя бы одно поле заполнено
                        />
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default CaloriesFilter;