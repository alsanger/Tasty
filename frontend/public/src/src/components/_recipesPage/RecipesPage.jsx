// Файл components/_recipesPage/RecipesPage.jsx
/*import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeFilterSidebar from '../../components/RecipeFilterSidebar/RecipeFilterSidebar';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants.js';
import './RecipesPage.scss';
import RecipeCardMini from "../Recipe/cards/RecipeCardMini.jsx";

const RecipesPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Получаем параметры из URL
    const getInitialFilters = () => {
        const initialFilters = {
            name: '',
            min_time: null,
            max_time: null,
            min_calories: '',
            max_calories: '',
            difficulty_min: 1,
            difficulty_max: 10,
            ingredients_include: [],
            ingredients_exclude: [],
            user_id: [],
            countries: [],
            cooking_methods: []
        };

        // Парсим ID стран из URL
        const countriesParam = searchParams.get('countries');
        if (countriesParam) {
            // Если страна указана, добавляем ее в массив стран
            initialFilters.countries = countriesParam.split(',').map(id => parseInt(id, 10));
        }

        // Можно добавить парсинг других параметров по аналогии

        return initialFilters;
    };

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(getInitialFilters());
    const isInitialMount = useRef(true);

    // Следим за изменениями URL
    useEffect(() => {
        setFilters(getInitialFilters());
    }, [location.search]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchRecipes(filters);
            return;
        }
        fetchRecipes(filters);
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const fetchRecipes = async (searchFilters = {}) => {
        setLoading(true);
        try {
            const requestData = Object.entries(searchFilters).reduce((acc, [key, value]) => {
                if (value !== null && value !== '' &&
                    (Array.isArray(value) ? value.length > 0 : true)) {
                    acc[key] = value;
                }
                return acc;
            }, {});

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
                        />
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        {loading ? (
                            <p>Завантаження рецептів...</p>
                        ) : (
                            <div className="recipes-grid">
                                {recipes.length === 0 ? (
                                    <p>Рецепти не знайдено</p>
                                ) : (
                                    recipes.map(recipe => (
                                        <div key={recipe.id} className="recipe-card">
                                            <RecipeCardMini
                                                recipe={recipe}
                                                width={300}
                                                height={320}
                                            />
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

export default RecipesPage;*/

// Файл components/_recipesPage/RecipesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeFilterSidebar from '../../components/RecipeFilterSidebar/RecipeFilterSidebar';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants.js';
import './RecipesPage.scss';
import RecipeCardMini from "../Recipe/cards/RecipeCardMini.jsx";

const RecipesPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Получаем параметры из URL
    const getInitialFilters = () => {
        const initialFilters = {
            name: '',
            min_time: null,
            max_time: null,
            min_calories: '',
            max_calories: '',
            difficulty_min: 1,
            difficulty_max: 10,
            ingredients_include: [],
            ingredients_exclude: [],
            user_id: [],
            countries: [],
            cooking_methods: []
        };

        // Получаем параметр name из URL
        const nameParam = searchParams.get('name');
        if (nameParam) {
            initialFilters.name = nameParam;
        }

        // Парсим ID стран из URL
        const countriesParam = searchParams.get('countries');
        if (countriesParam) {
            // Если страна указана, добавляем ее в массив стран
            initialFilters.countries = countriesParam.split(',').map(id => parseInt(id, 10));
        }

        // Можно добавить парсинг других параметров по аналогии

        return initialFilters;
    };

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(getInitialFilters());
    const isInitialMount = useRef(true);

    // Следим за изменениями URL
    useEffect(() => {
        setFilters(getInitialFilters());
    }, [location.search]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchRecipes(filters);
            return;
        }
        fetchRecipes(filters);
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const fetchRecipes = async (searchFilters = {}) => {
        setLoading(true);
        try {
            const requestData = Object.entries(searchFilters).reduce((acc, [key, value]) => {
                if (value !== null && value !== '' &&
                    (Array.isArray(value) ? value.length > 0 : true)) {
                    acc[key] = value;
                }
                return acc;
            }, {});

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
                        />
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        {loading ? (
                            <p>Завантаження рецептів...</p>
                        ) : (
                            <div className="recipes-grid">
                                {recipes.length === 0 ? (
                                    <p>Рецепти не знайдено</p>
                                ) : (
                                    recipes.map(recipe => (
                                        <div key={recipe.id} className="recipe-card">
                                            <RecipeCardMini
                                                recipe={recipe}
                                                width={300}
                                                height={320}
                                            />
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