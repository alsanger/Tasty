// Файл components/Recipe/Recipe.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { LuMessageSquareMore } from 'react-icons/lu';
import { BASE_URL } from "../../utils/constants.js";
import './Recipe.scss';
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Reviews from "../Reviews/Reviews.jsx";
import { getRecipeById } from '../../utils/fetchApi/recipeApi.js';

const Recipe = () => {
    const location = useLocation();
    const [recipe, setRecipe] = useState(location.state?.recipe || null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Проверка наличия данных о рецепте
    if (!recipe) {
        return <p>No recipe data available!</p>;
    }

    // Функция для обработки клика по кнопке "избранное"
    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    // Функция для обновления данных рецепта
    const updateRecipeData = async () => {
        setIsLoading(true);
        try {
            const response = await getRecipeById(recipe.id);
            setRecipe(response.data);
        } catch (error) {
            console.error('Ошибка при обновлении данных рецепта:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для форматирования числового значения (удаления лишних нулей)
    const formatQuantity = (quantity) => {
        if (quantity === undefined || quantity === null) return '';

        // Преобразуем в число
        const num = parseFloat(quantity);

        // Проверяем, является ли число целым
        if (Number.isInteger(num)) {
            return num.toString();
        }

        // Удаляем лишние нули после запятой
        return num.toString().replace(/\.?0+$/, '');
    };

    // Расчет калорийности на 100г продукта
    const calculateCaloriesPer100g = () => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;

        let totalCalories = 0;
        let totalWeight = 0;

        recipe.ingredients.forEach(ingredient => {
            const calories = parseFloat(ingredient.calories);
            const quantity = parseFloat(ingredient.quantity);

            if (!isNaN(calories) && !isNaN(quantity)) {
                totalCalories += calories * quantity;
                totalWeight += quantity;
            }
        });

        return totalWeight > 0 ? Math.round(totalCalories / totalWeight * 100) : 0;
    };

    const caloriesPer100g = calculateCaloriesPer100g();

    // Расчет среднего рейтинга
    const calculateAverageRating = () => {
        if (!recipe.reviews || recipe.reviews.length === 0) return 0;

        const sum = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / recipe.reviews.length;
    };

    const averageRating = calculateAverageRating();

    // Отображение звездочек рейтинга
    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<FaStar key={i} className="star-icon"/>);
            } else if (i - 0.5 === roundedRating) {
                stars.push(<FaStarHalfAlt key={i} className="star-icon"/>);
            } else {
                stars.push(<FaRegStar key={i} className="star-icon"/>);
            }
        }

        return stars;
    };

    // Проверка наличия шагов рецепта
    const hasSteps = recipe.recipeSteps && recipe.recipeSteps.length > 0;

    // Сортировка шагов по номеру
    const sortedSteps = hasSteps
        ? [...recipe.recipeSteps].sort((a, b) => a.step_number - b.step_number)
        : [];

    return (
        <Container fluid className="recipe-container">
            {isLoading && (
                <div className="text-center my-3">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
                </div>
            )}
            <Row>
                <Col md={6} className="recipe-image-col">
                    <div className="image-container">
                        <Image src={`${BASE_URL}${recipe.image_url}`} alt={recipe.name} fluid/>
                        <button
                            className="favorite-btn"
                            onClick={handleFavoriteClick}
                        >
                            {isFavorite ? <IoHeart className="heart-icon filled"/> :
                                <IoHeartOutline className="heart-icon"/>}
                        </button>
                    </div>

                    {/* RecipeSteps section */}
                    {hasSteps && (
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
                    )}
                </Col>
                <Col md={6} className="recipe-info-col">
                    <div className="recipe-info">
                        <h1 className="recipe-title">{recipe.name}</h1>
                        <p className="recipe-description">{recipe.description}</p>

                        <h3 className="ingredients-title">Інгредієнти</h3>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id} className="ingredient-item">
                                    <span className="ingredient-name">{ingredient.name}</span>
                                    <span className="ingredient-dots"></span>
                                    <span className="ingredient-quantity">
                                        {formatQuantity(ingredient.quantity)} {ingredient.short_name}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="recipe-meta">
                            <p className="recipe-time">
                                Час приготування: {recipe.time} хв.
                            </p>
                            <p className="recipe-calories">
                                Калорійність (на 100 гр. продукту): {caloriesPer100g} ккал.
                            </p>
                            <div className="recipe-rating">
                                <span className="review-count">{recipe.reviews.length}</span>
                                <LuMessageSquareMore className="message-icon"/>
                                <span className="rating-stars">
                                    {renderStars(averageRating)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="recipe-reviews-section">
                <Col>
                    <Reviews
                        recipeId={recipe.id}
                        initialReviews={recipe.reviews}
                        onRecipeUpdate={updateRecipeData}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Recipe;