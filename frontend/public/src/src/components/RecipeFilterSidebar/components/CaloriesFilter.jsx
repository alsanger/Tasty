import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Input from '../../_common/Input/Input';

const CaloriesFilter = ({ minCalories, maxCalories, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? '' : Number(value);
        onChange(name, numValue);
    };

    return (
        <div className="filter-section">
            <Row className="calories-inputs">
                <Col>
                    <Input
                        type="number"
                        name="min_calories"
                        placeholder="100"
                        value={minCalories}
                        onChange={handleChange}
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
                        value={maxCalories}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default CaloriesFilter;