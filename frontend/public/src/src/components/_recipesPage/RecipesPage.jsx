// components/_recipesPage/RecipesPage.jsx
import React, {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import RecipeFilterSidebar from '../../components/RecipeFilterSidebar/RecipeFilterSidebar';
import axios from 'axios';
import {API_BASE_URL, ENDPOINTS} from '../../utils/constants.js';
import './RecipesPage.scss';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        // Початкові значення фільтрів
        max_time: 15,
        cooking_methods: [1],
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = async (searchFilters) => {
        setLoading(true);
        try {
            // Формуємо параметри запиту, виключаючи порожні значення
            const requestData = Object.entries(searchFilters).reduce((acc, [key, value]) => {
                if (value !== null && value !== '' &&
                    (Array.isArray(value) ? value.length > 0 : true)) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            // Додаємо додаткові параметри за потреби
            requestData.per_page = 10;
            requestData.order_by = 'name';
            requestData.order_direction = 'asc';

            const response = await axios.post(
                `${API_BASE_URL}${ENDPOINTS.SEARCH_RECIPES}`,
                requestData
            );

            setRecipes(response.data.data);
        } catch (error) {
            console.error('Помилка при пошуку рецептів:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <div className="recipes-page">
                <Row>
                    <Col xs={12} md={4} lg={3}>
                        <RecipeFilterSidebar
                            initialFilters={filters}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        {loading ? (
                            <p>Завантаження рецептів...</p>
                        ) : (
                            <div className="recipes-grid">
                                {/* Тут буде відображення рецептів */}
                                {recipes.length === 0 ? (
                                    <p>Рецепти не знайдено</p>
                                ) : (
                                    recipes.map(recipe => (
                                        <div key={recipe.id} className="recipe-card">
                                            <h3>{recipe.name}</h3>
                                            {/* Інша інформація про рецепт */}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default RecipesPage;