// Файл RecipeGridDayWeekMonth.jsx:
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../Recipe/cards/RecipeCard.jsx';
import { getTopDayRecipeRecipes, getTopWeekRecipeRecipes, getTopMonthRecipeRecipes } from '../../utils/fetchApi/recipeApi.js';
import {useNavigate} from "react-router-dom";
import recipe from "../_recipe/Recipe.jsx";

const RecipeGridDayWeekMonth = () => {
    // Состояния для хранения ID рецептов
    const [dayRecipe, setDayRecipe] = useState(null);
    const [weekRecipe, setWeekRecipeId] = useState(null);
    const [monthRecipe, setMonthRecipe] = useState(null);

    // Состояния для индикации загрузки и ошибок
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Хук для навигации
    const navigate = useNavigate();

    // Загрузка рецептов при монтировании компонента
    useEffect(() => {
        const fetchTopRecipes = async () => {
            try {
                console.log('Начало загрузки топовых рецептов...');
                setLoading(true);

                // Загрузка рецепта дня
                const dayResponse = await getTopDayRecipeRecipes();
                if (dayResponse && dayResponse.data && dayResponse.data.length > 0) {
                    console.log('Данные рецепта дня получены:', dayResponse.data[0]);
                    setDayRecipe(dayResponse.data[0]);
                }

                // Загрузка рецепта недели
                const weekResponse = await getTopWeekRecipeRecipes();
                if (weekResponse && weekResponse.data && weekResponse.data.length > 0) {
                    console.log('Данные рецепта недели получены:', weekResponse.data[0]);
                    setWeekRecipeId(weekResponse.data[0]);
                }

                // Загрузка рецепта месяца
                const monthResponse = await getTopMonthRecipeRecipes();
                if (monthResponse && monthResponse.data && monthResponse.data.length > 0) {
                    console.log('Данные рецепта месяца получены:', monthResponse.data[0]);
                    setMonthRecipe(monthResponse.data[0]);
                }

            } catch (err) {
                console.error('Ошибка загрузки топовых рецептов:', err);
                setError('Не удалось загрузить топовые рецепты');
            } finally {
                console.log('Загрузка топовых рецептов завершена.');
                setLoading(false);
            }
        };

        fetchTopRecipes();
    }, []);

    if (loading) return <div className="mt-4">Загрузка рецептов...</div>;
    if (error) return <div className="mt-4">{error}</div>;
    if (!dayRecipe && !weekRecipe && !monthRecipe) return <div className="mt-4">Рецепты отсутствуют</div>;

    return (
        <Container fluid className="mt-4">
            <Row className="mb-0">
                <Col xs={12} md={6} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {dayRecipe && (
                        <RecipeCard
                            recipe={dayRecipe}
                            showAuthor={true}
                            featuredText="Рецепт дня"
                        />
                    )}
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {weekRecipe && (
                        <RecipeCard
                            recipe={weekRecipe}
                            showAuthor={true}
                            featuredText="Рецепт тижня"
                        />
                    )}
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {monthRecipe && (
                        <RecipeCard
                            recipe={monthRecipe}
                            showAuthor={true}
                            featuredText="Рецепт місяця"
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RecipeGridDayWeekMonth;