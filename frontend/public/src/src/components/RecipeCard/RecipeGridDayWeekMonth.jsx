import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCard';
import {FONT_FAMILIES} from "../../utils/constants.js";

const RecipeGridTheBest = () => {
    // Функция для обработки клика
    const handleRecipeClick = (recipeId) => {
        console.log(`Navigating to recipe page with ID: ${recipeId}`);
        // navigate(`/recipes/${recipeId}`);
    };

    return (
        <Container fluid className="mt-5">
            <h2 className="mb-4" style={{ fontFamily: FONT_FAMILIES.PRIMARY }}>Найкращі</h2>
            <Row className="mb-5">
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={13}
                        showAuthor={true}
                        onClick={handleRecipeClick}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={13}
                        showAuthor={false}
                        featuredText="Рецепт дня"
                        onClick={handleRecipeClick}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '15/9' }}>
                    <RecipeCard
                        recipeId={13}
                        showAuthor={true}
                        onClick={handleRecipeClick}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default RecipeGridTheBest;