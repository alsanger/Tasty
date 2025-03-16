// TimeFilter.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const TimeFilter = ({ selectedTime, onChange }) => {
    const timeOptions = [
        { id: 15, label: 'До 15 хвилин' },
        { id: 30, label: '15-30 хвилин' },
        { id: 60, label: '30-60 хвилин' },
        { id: 61, label: 'Більше 1 години' }
    ];

    const handleTimeChange = (time) => {
        onChange(time);
    };

    return (
        <div className="filter-section">
            {timeOptions.map((option) => (
                <Form.Check
                    key={option.id}
                    type="checkbox"
                    id={`time-${option.id}`}
                    label={option.label}
                    checked={selectedTime === option.id}
                    onChange={() => handleTimeChange(option.id)}
                />
            ))}
        </div>
    );
};

export default TimeFilter;