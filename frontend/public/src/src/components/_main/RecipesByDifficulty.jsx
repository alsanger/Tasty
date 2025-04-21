import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCardById from "../Recipe/cards/byId/RecipeCardById.jsx";
import {useNavigate} from "react-router-dom";

const RecipesByDifficulty = () => {
    const navigate = useNavigate();
    const handleDifficultyClick = (difficulty_min, difficulty_max, e) => {
        e?.stopPropagation(); // Опционально, если нужно предотвратить всплытие
        navigate(`/recipes?difficulty_min=${difficulty_min}&difficulty_max=${difficulty_max}`);
    };

    return (
        <Container fluid className="mt-5">
            <Row className="mb-5">
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Легкі</h1>
                    <RecipeCardById
                        recipeId={20}
                        showAuthor={false}
                        onClick={() => handleDifficultyClick(1, 3)}
                        name={"Швидкі страви для кожного"}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Середні</h1>
                    <RecipeCardById
                        recipeId={18}
                        showAuthor={false}
                        onClick={() => handleDifficultyClick(4, 6)}
                        name={"Трішки складніше - ще смачніше"}
                    />
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-4" style={{ aspectRatio: '5/4' }}>
                    <h1 className="mb-4">Складні</h1>
                    <RecipeCardById
                        recipeId={15}
                        showAuthor={false}
                        onClick={() => handleDifficultyClick(7, 10)}
                        name={"Випробуй свої кулінарні навички"}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default RecipesByDifficulty;