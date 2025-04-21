// Файл components/RecipeFilterSidebar/components/CookingMethodFilter.jsx:
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../../utils/constants.js';

const CookingMethodFilter = ({ selectedMethods, onChange }) => {
    const [cookingMethods, setCookingMethods] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCookingMethods = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.COOKING_METHODS}`);
                setCookingMethods(response.data.data);
            } catch (error) {
                console.error('Помилка при завантаженні способів приготування:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCookingMethods();
    }, []);

    const handleMethodChange = (id) => {
        const newSelectedMethods = selectedMethods.includes(id)
            ? selectedMethods.filter(item => item !== id)
            : [...selectedMethods, id];

        onChange(newSelectedMethods);
    };

    return (
        <div className="filter-section">
            {loading ? (
                <p>Завантаження...</p>
            ) : (
                cookingMethods.map(method => (
                    <Form.Check
                        key={method.id}
                        type="checkbox"
                        id={`method-${method.id}`}
                        label={method.name}
                        checked={selectedMethods.includes(method.id)}
                        onChange={() => handleMethodChange(method.id)}
                    />
                ))
            )}
        </div>
    );
};

export default CookingMethodFilter;