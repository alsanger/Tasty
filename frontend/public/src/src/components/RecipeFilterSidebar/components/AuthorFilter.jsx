// Файл components/RecipeFilterSidebar/components/AuthorFilter.jsx:
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Input from '../../_common/Input/Input';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../../utils/constants.js';

const AuthorFilter = ({ selectedAuthors, onChange }) => {
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.USERS}`);
                setAuthors(response.data.data);
            } catch (error) {
                console.error('Помилка при завантаженні авторів:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAuthorChange = (id) => {
        const newSelectedAuthors = selectedAuthors.includes(id)
            ? selectedAuthors.filter(item => item !== id)
            : [...selectedAuthors, id];

        onChange(newSelectedAuthors);
    };

    const filteredAuthors = authors.filter(author =>
        author.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="filter-section">
            <Input
                type="text"
                name="author-search"
                placeholder="Пошук"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="authors-list">
                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    filteredAuthors.map(author => (
                        <Form.Check
                            key={author.id}
                            type="checkbox"
                            id={`author-${author.id}`}
                            label={author.display_name}
                            checked={selectedAuthors.includes(author.id)}
                            onChange={() => handleAuthorChange(author.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AuthorFilter;