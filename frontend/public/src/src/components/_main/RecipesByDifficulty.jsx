import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../Recipe/RecipeCard.jsx';
import {FONT_FAMILIES} from "../../utils/constants.js";

const RecipesByDifficulty = () => {
    // Функция для обработки клика
    const handleRecipeClick = (recipeId) => {
        console.log(`Navigating to recipe page with ID: ${recipeId}`);
        // navigate(`/recipes/${recipeId}`);
    };

    return (
        <Container fluid className="mt-5">
            <Row className="mb-5">
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Легкі</h1>
                    <RecipeCard
                        recipeId={20}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                        name={"Швидкі страви для кожного"}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Середні</h1>
                    <RecipeCard
                        recipeId={18}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                        name={"Трішки складніше - ще смачніше"}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Складні</h1>
                    <RecipeCard
                        recipeId={15}
                        showAuthor={false}
                        onClick={handleRecipeClick}
                        name={"Випробуй свої кулінарні навички"}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default RecipesByDifficulty;