// components/Recipe/RecipeSteps/RecipeSteps.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BASE_URL } from "../../../utils/constants.js";
import './RecipeSteps.scss';

const RecipeSteps = ({ recipe }) => {
    // Проверка наличия шагов рецепта
    if (!recipe || !recipe.recipeSteps || recipe.recipeSteps.length === 0) {
        console.log('Ошибка: отсутствуют шаги рецепта');
        return null;
    }

    // Сортировка шагов по номеру
    const sortedSteps = [...recipe.recipeSteps].sort((a, b) => a.step_number - b.step_number);

    return (
        <Row>
            <Col md={6}>
                <div className="recipe-steps">
                    {sortedSteps.map((step) => (
                        <div key={step.id} className="recipe-step-item">
                            <div className="recipe-step-content">
                                <div className="recipe-step-number">{step.step_number}</div>
                                <div className="recipe-step-description">{step.description}</div>
                            </div>
                            {step.image_url && (
                                <div className="recipe-step-image">
                                    <img
                                        src={`${BASE_URL}${step.image_url}`}
                                        alt={`Шаг ${step.step_number}`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Col>
        </Row>
    );
};

export default RecipeSteps;