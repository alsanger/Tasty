// Файл components/RecipeFilterSidebar/components/SmartFridgeFilter.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const SmartFridgeFilter = ({ isEnabled, onChange }) => {
    return (
        <div className="filter-section">
            <Form.Check
                type="checkbox"
                id="smart-fridge"
                label="За наявними інгредієнтами"
                checked={isEnabled}
                onChange={(e) => onChange(e.target.checked)}
            />
        </div>
    );
};

export default SmartFridgeFilter;
