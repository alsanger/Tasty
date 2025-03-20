// Файл components/RecipeFilterSidebar/components/TimeFilter.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const TimeFilter = ({ selectedTime, onChange }) => {
    const timeOptions = [
        { id: 15, label: 'До 15 хвилин' },
        { id: 30, label: 'До 30 хвилин' },
        { id: 60, label: 'До 60 хвилин' },
        { id: 629440, label: 'До 1 години і більше' }
    ];

    const handleTimeChange = (time) => {
        // Если нажали на уже выбранный вариант - сбрасываем выбор
        onChange(selectedTime === time ? null : time);
    };

    return (
        <div className="filter-section">
            {timeOptions.map((option) => (
                <Form.Check
                    key={option.id}
                    type="radio" // Изменил на radio для логически правильного выбора
                    id={`time-${option.id}`}
                    name="timeFilter" // Имя группы для радиокнопок
                    label={option.label}
                    checked={selectedTime === option.id}
                    onChange={() => handleTimeChange(option.id)}
                />
            ))}
        </div>
    );
};

export default TimeFilter;