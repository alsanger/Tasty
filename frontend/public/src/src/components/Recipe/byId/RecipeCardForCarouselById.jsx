// Файл RecipeCardForCarouselById.jsx
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeartOutline, IoHeart, IoTimeOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { getRecipeById } from '../../../utils/fetchApi/recipeApi.js';
import './RecipeCardForCarouselById.scss';
import { BASE_URL, FONT_FAMILIES } from "../../../utils/constants.js";

const RecipeCardForCarouselById = ({
                                  recipeId,
                                  onClick
                              }) => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const response = await getRecipeById(recipeId);
                setRecipe(response.data);
                setError(null);
            } catch (err) {
                console.error('Ошибка при загрузке рецепта:', err);
                setError('Не удалось загрузить рецепт');
            } finally {
                setLoading(false);
            }
        };

        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]);

    const handleClick = () => {
        if (onClick && recipe) {
            onClick(recipe.id);
        } else if (recipe) {
            console.log(`Clicked on recipe: ${recipe.name} (ID: ${recipe.id})`);
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки
        setIsFavorite(!isFavorite);
    };

    // Расчет средней оценки рецепта
    const calculateAverageRating = () => {
        if (!recipe || !recipe.reviews || recipe.reviews.length === 0) {
            return 0;
        }

        const sum = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / recipe.reviews.length;
    };

    // Формирование списка ингредиентов
    const getIngredientsList = () => {
        if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
            return '';
        }

        return recipe.ingredients.map(ingredient => ingredient.name).join(', ');
    };

    if (loading) {
        return (
            <div className="recipe-card-horizontal-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-card-horizontal-container d-flex justify-content-center align-items-center">
                <div className="text-center text-muted">
                    {error || 'Рецепт не найден'}
                </div>
            </div>
        );
    }

    const averageRating = calculateAverageRating();
    const reviewsCount = recipe.reviews ? recipe.reviews.length : 0;
    const ingredientsList = getIngredientsList();

    return (
        <div className="recipe-card-horizontal-container">
            <Card className="recipe-card-horizontal" onClick={handleClick}>
                <div className="recipe-image-container">
                    <Card.Img
                        className="recipe-image"
                        src={`${BASE_URL}${recipe.image_url}`}
                        alt={recipe.name}
                    />
                    <div className="favorite-button" onClick={handleFavoriteClick}>
                        {isFavorite ? <IoHeart className="favorite-icon active" /> : <IoHeartOutline className="favorite-icon" />}
                    </div>
                </div>
                <div className="recipe-details">
                    <h2 className="recipe-name">{recipe.name}</h2>
                    <p className="recipe-ingredients">
                        {ingredientsList}
                    </p>
                    <div className="recipe-footer">
                        <div className="recipe-time">
                            <IoTimeOutline className="time-icon" />
                            <span>{recipe.time} хв.</span>
                        </div>
                        <div className="recipe-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={index < Math.round(averageRating) ? 'star-filled' : 'star-empty'}
                                    />
                                ))}
                            </div>
                            <span className="reviews-count">{reviewsCount}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RecipeCardForCarouselById;