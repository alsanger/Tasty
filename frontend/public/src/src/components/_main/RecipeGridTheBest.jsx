import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../Recipe/RecipeCard.jsx';
import {FONT_FAMILIES} from "../../utils/constants.js";
import {getPopularRecipes} from "../../utils/fetchApi/recipeApi.js";

const RecipeGridTheBest = () => {
    // Состояния для хранения ID рецептов
    const [bestRecipes, setBestRecipes] = useState([]);

    // Состояния для индикации загрузки и ошибок
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка рецептов при монтировании компонента
    useEffect(() => {
        const fetchTopRecipes = async () => {
            try {
                console.log('Начало загрузки топовых рецептов...');
                setLoading(true);

                // Загрузка массива рецептов
                const bestRecipesResponse = await getPopularRecipes();
                if (bestRecipesResponse && bestRecipesResponse.data && bestRecipesResponse.data.length > 3) {
                    console.log('Данные рецепта дня получены:');
                    setBestRecipes(bestRecipesResponse.data);
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
    if (!bestRecipes) return <div className="mt-4">Рецепты отсутствуют</div>;

    return (
        <Container fluid className="mt-0">
            <h2 className="mb-4" style={{ fontFamily: FONT_FAMILIES.PRIMARY }}>Найкращі</h2>
            <Row className="mb-0">
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={bestRecipes[0].id}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={bestRecipes[1].id}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={bestRecipes[2].id}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default RecipeGridTheBest;