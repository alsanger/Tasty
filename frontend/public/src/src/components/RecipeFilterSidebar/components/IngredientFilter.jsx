// Файл components/RecipeFilterSidebar/components/IngredientFilter.jsx:
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Input from '../../_common/Input/Input';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../../utils/constants.js';

const IngredientFilter = ({ title, selectedIngredients, onChange, endpoint = ENDPOINTS.INGREDIENTS }) => {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${endpoint}`);
                setIngredients(response.data.data);
            } catch (error) {
                console.error('Помилка при завантаженні інгредієнтів:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, [endpoint]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleIngredientChange = (id) => {
        const newSelectedIngredients = selectedIngredients.includes(id)
            ? selectedIngredients.filter(item => item !== id)
            : [...selectedIngredients, id];

        onChange(newSelectedIngredients);
    };

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="filter-section">
            <Input
                type="text"
                name="ingredient-search"
                placeholder="Пошук"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="ingredients-list">
                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    filteredIngredients.map(ingredient => (
                        <Form.Check
                            key={ingredient.id}
                            type="checkbox"
                            id={`${title}-${ingredient.id}`}
                            label={ingredient.name}
                            checked={selectedIngredients.includes(ingredient.id)}
                            onChange={() => handleIngredientChange(ingredient.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default IngredientFilter;