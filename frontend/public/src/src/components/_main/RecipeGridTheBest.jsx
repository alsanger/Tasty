import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../Recipe/cards/RecipeCard.jsx';
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
                console.log('Начало загрузки 3 топовых рецептов...');
                setLoading(true);

                // Загрузка массива рецептов
                const bestRecipesResponse = await getPopularRecipes();
                if (bestRecipesResponse && bestRecipesResponse.data && bestRecipesResponse.data.length > 3) {
                    console.log('Данные 3 топовых рецептов получены:');
                    setBestRecipes(bestRecipesResponse.data);
                }
            } catch (err) {
                console.error('Ошибка загрузки 3 топовых рецептов:', err);
                setError('Не удалось загрузить 3 топовые рецепта');
            } finally {
                console.log('Загрузка 3 топовых рецептов завершена.');
                setLoading(false);
            }
        };

        fetchTopRecipes();
    }, []);

    if (loading) return <div className="mt-4">Загрузка рецептов...</div>;
    if (error) return <div className="mt-4">{error}</div>;
    if (!bestRecipes) return <div className="mt-4">Рецепты отсутствуют</div>;

    return (
        <Container fluid className="mt-0">
            <h1 className="mb-4">Найкращі</h1>
            <Row className="mb-0">
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipe={bestRecipes[0]}
                        showAuthor={false}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipe={bestRecipes[1]}
                        showAuthor={false}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipe={bestRecipes[2]}
                        showAuthor={false}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default RecipeGridTheBest;