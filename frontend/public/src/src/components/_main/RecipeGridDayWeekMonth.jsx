// Файл RecipeGridDayWeekMonth.jsx:
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../Recipe/RecipeCard.jsx';
import { getTopDayRecipeRecipes, getTopWeekRecipeRecipes, getTopMonthRecipeRecipes } from '../../utils/fetchApi/recipeApi.js';

const RecipeGridDayWeekMonth = () => {
    // Состояния для хранения ID рецептов
    const [dayRecipeId, setDayRecipeId] = useState(null);
    const [weekRecipeId, setWeekRecipeId] = useState(null);
    const [monthRecipeId, setMonthRecipeId] = useState(null);

    // Состояния для индикации загрузки и ошибок
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка рецептов при монтировании компонента
    useEffect(() => {
        const fetchTopRecipes = async () => {
            try {
                console.log('Начало загрузки топовых рецептов...');
                setLoading(true);

                // Загрузка рецепта дня
                const dayResponse = await getTopDayRecipeRecipes();
                if (dayResponse && dayResponse.data && dayResponse.data.length > 0) {
                    console.log('Данные рецепта дня получены:', dayResponse.data[0].id);
                    setDayRecipeId(dayResponse.data[0].id);
                }

                // Загрузка рецепта недели
                const weekResponse = await getTopWeekRecipeRecipes();
                if (weekResponse && weekResponse.data && weekResponse.data.length > 0) {
                    console.log('Данные рецепта недели получены:', weekResponse.data[0].id);
                    setWeekRecipeId(weekResponse.data[0].id);
                }

                // Загрузка рецепта месяца
                const monthResponse = await getTopMonthRecipeRecipes();
                if (monthResponse && monthResponse.data && monthResponse.data.length > 0) {
                    console.log('Данные рецепта месяца получены:', monthResponse.data[0].id);
                    setMonthRecipeId(monthResponse.data[0].id);
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

    // Функция для обработки клика
    const handleRecipeClick = (recipeId) => {
        console.log(`Navigating to recipe page with ID: ${recipeId}`);
        // navigate(`/recipes/${recipeId}`);
    };

    if (loading) return <div className="mt-4">Загрузка рецептов...</div>;
    if (error) return <div className="mt-4">{error}</div>;
    if (!dayRecipeId && !weekRecipeId && !monthRecipeId) return <div className="mt-4">Рецепты отсутствуют</div>;

    return (
        <Container fluid className="mt-4">
            <Row className="mb-0">
                <Col xs={12} md={6} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {dayRecipeId && (
                        <RecipeCard
                            recipeId={dayRecipeId}
                            showAuthor={true}
                            featuredText="Рецепт дня"
                            onClick={handleRecipeClick}
                        />
                    )}
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {weekRecipeId && (
                        <RecipeCard
                            recipeId={weekRecipeId}
                            showAuthor={true}
                            featuredText="Рецепт тижня"
                            onClick={handleRecipeClick}
                        />
                    )}
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    {monthRecipeId && (
                        <RecipeCard
                            recipeId={monthRecipeId}
                            showAuthor={true}
                            featuredText="Рецепт місяця"
                            onClick={handleRecipeClick}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RecipeGridDayWeekMonth;
