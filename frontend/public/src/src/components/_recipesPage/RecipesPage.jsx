// Файл components/_recipesPage/RecipesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeFilterSidebar from '../../components/RecipeFilterSidebar/RecipeFilterSidebar';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants.js';
import './RecipesPage.scss';
import RecipeCardMini from "../Recipe/cards/RecipeCardMini.jsx";
import { useUser } from '../../contexts/UserContext';

const RecipesPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { user } = useUser(); // Получаем пользователя через хук

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
            authors: [],
            countries: [],
            cooking_methods: [],
            fridge: false,
            categories: [],
        };

        // Получаем параметр name из URL
        const nameParam = searchParams.get('name');
        if (nameParam) {
            initialFilters.name = nameParam;
        }

        // Парсим ID категорий из URL
        const categoriesParam = searchParams.get('categories');
        if (categoriesParam) {
            // Если категории указаны, добавляем их в массив категорий
            initialFilters.categories = categoriesParam.split(',').map(id => parseInt(id));
        }

        // Парсим ID авторов из URL
        const authorsParam = searchParams.get('authors');
        if (authorsParam) {
            // Если авторы указаны, добавляем их в массив авторов
            initialFilters.authors = authorsParam.split(',').map(id => parseInt(id));
        }

        // Получаем параметры difficulty_min и difficulty_max из URL
        const difficultyMinParam = searchParams.get('difficulty_min');
        if (difficultyMinParam) {
            initialFilters.difficulty_min = difficultyMinParam;
        }
        const difficultyMaxParam = searchParams.get('difficulty_max');
        if (difficultyMaxParam) {
            initialFilters.difficulty_max = difficultyMaxParam;
        }

        // Получаем параметр fridge из URL
        const fridgeParam = searchParams.get('fridge');
        if (fridgeParam === 'true') {
            initialFilters.fridge = true;
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

            // Добавляем fridge и current_user_id если включен умный холодильник и пользователь авторизован
            if (searchFilters.fridge && user?.id) {
                requestData.fridge = searchFilters.fridge;
                requestData.current_user_id = user.id;
            }

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
