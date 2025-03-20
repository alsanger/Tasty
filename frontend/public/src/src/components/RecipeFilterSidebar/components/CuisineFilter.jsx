// Файл components/RecipeFilterSidebar/components/CuisineFilter.jsx:
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Input from '../../_common/Input/Input';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../../utils/constants.js';

const CuisineFilter = ({ selectedCuisines, onChange }) => {
    const [cuisines, setCuisines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCuisines = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.COUNTRIES}`);
                setCuisines(response.data.data);
            } catch (error) {
                console.error('Помилка при завантаженні кухонь світу:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCuisines();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCuisineChange = (id) => {
        const newSelectedCuisines = selectedCuisines.includes(id)
            ? selectedCuisines.filter(item => item !== id)
            : [...selectedCuisines, id];

        onChange(newSelectedCuisines);
    };

    const filteredCuisines = cuisines.filter(cuisine =>
        cuisine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="filter-section">
            <Input
                type="text"
                name="cuisine-search"
                placeholder="Пошук"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="cuisines-list">
                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    filteredCuisines.map(cuisine => (
                        <Form.Check
                            key={cuisine.id}
                            type="checkbox"
                            id={`cuisine-${cuisine.id}`}
                            label={cuisine.name}
                            checked={selectedCuisines.includes(cuisine.id)}
                            onChange={() => handleCuisineChange(cuisine.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CuisineFilter;