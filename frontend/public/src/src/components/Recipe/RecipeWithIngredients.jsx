// components/Recipe/Recipe.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { LuMessageSquareMore } from 'react-icons/lu';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Recipe.scss';

const Recipe = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Обчислення середнього рейтингу
    const calculateAverageRating = () => {
        if (!recipe || !recipe.reviews || recipe.reviews.length === 0) {
            return 0;
        }

        const sum = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / recipe.reviews.length;
    };

    // Обчислення калорійності на 100г продукту
    const calculateCaloriesPer100g = () => {
        if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
            return 0;
        }

        // Загальна калорійність всіх інгредієнтів
        let totalCalories = 0;
        // Загальна вага всіх інгредієнтів
        let totalWeight = 0;

        recipe.ingredients.forEach(ingredient => {
            // Кількість у грамах (припускаємо, що всі величини приведені до грамів)
            const quantity = parseFloat(ingredient.quantity);
            const caloriesPer100g = parseFloat(ingredient.calories);

            // Калорійність інгредієнта
            const ingredientCalories = (caloriesPer100g * quantity) / 100;

            totalCalories += ingredientCalories;
            totalWeight += quantity;
        });

        // Калорійність на 100г готового продукту
        return totalWeight > 0 ? Math.round((totalCalories / totalWeight) * 100) : 0;
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    // Функція для рендерингу зірок рейтингу
    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2; // Округлення до 0.5

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<FaStar key={i} className="star-icon" />);
            } else if (i - 0.5 === roundedRating) {
                stars.push(<FaStarHalfAlt key={i} className="star-icon" />);
            } else {
                stars.push(<FaRegStar key={i} className="star-icon" />);
            }
        }

        return stars;
    };

    const averageRating = calculateAverageRating();
    const caloriesPer100g = calculateCaloriesPer100g();

    return (
        <Container fluid className="recipe-container">
            <Row>
                <Col md={6} className="recipe-image-col">
                    <div className="image-container">
                        <Image src={recipe.image_url} alt={recipe.name} fluid />
                        <button
                            className="favorite-btn"
                            onClick={handleFavoriteClick}
                        >
                            {isFavorite ? <IoHeart className="heart-icon filled" /> : <IoHeartOutline className="heart-icon" />}
                        </button>
                    </div>
                </Col>
                <Col md={6} className="recipe-info-col">
                    <div className="recipe-info">
                        <h2 className="recipe-title">{recipe.name}</h2>
                        <p className="recipe-description">{recipe.description}</p>

                        <h3 className="ingredients-title">Інгрідієнти</h3>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id} className="ingredient-item">
                                    <span className="ingredient-name">{ingredient.name}</span>
                                    <span className="ingredient-dots"></span>
                                    <span className="ingredient-quantity">
                    {ingredient.quantity} {ingredient.short_name}
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
                                <LuMessageSquareMore className="message-icon" />
                                <span className="rating-stars">
                  {renderStars(averageRating)}
                </span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Recipe;