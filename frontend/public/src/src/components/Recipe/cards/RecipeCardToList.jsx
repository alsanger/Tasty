// Файл components/Recipe/cards/RecipeCardToList.jsx
import React from 'react';
import {Card} from 'react-bootstrap';
import {IoTimeOutline} from "react-icons/io5";
import {FaStar} from "react-icons/fa";
import './RecipeCardToList.scss';
import {BASE_URL} from "../../../utils/constants.js";
import {useNavigate} from "react-router-dom";

const RecipeCardToList = ({
                              recipe,
                              onClick,
                              width = 400,
                              height = 130,
                              fridgeIngredients = []
                          }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick && recipe) {
            console.log(`Вызов внешней функции onClick с ID: ${recipe.id}`);
            onClick(recipe.id);
        } else if (recipe) {
            console.log(`Navigating to recipe page with ID: ${recipe.id}`);
            navigate(`/recipe/${recipe.id}`, {
                state: {recipe},
            });
        }
    };

    // Проверка наличия ингредиентов
    const checkMissingIngredients = () => {
        if (!recipe.ingredients || !fridgeIngredients) {
            return {hasAllIngredients: false, missingIngredients: []};
        }

        // Создаем массив ID ингредиентов пользователя, количество которых > 0
        const fridgeIngredientsIds = fridgeIngredients
            .filter(ingredient => ingredient.quantity > 0)
            .map(ingredient => ingredient.id);

        // Находим недостающие ингредиенты
        const missingIngredients = recipe.ingredients.filter(
            ingredient => !fridgeIngredientsIds.includes(ingredient.id)
        );

        return {
            hasAllIngredients: missingIngredients.length === 0,
            missingIngredients
        };
    };

    // Расчет средней оценки рецепта
    const calculateAverageRating = () => {
        if (!recipe || !recipe.reviews || recipe.reviews.length === 0) {
            return 0;
        }

        const sum = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / recipe.reviews.length;
    };

    if (!recipe) {
        return (
            <div className="recipe-card-to-list-container d-flex justify-content-center align-items-center">
                <div className="text-center text-muted">
                    {'Рецепт не найден'}
                </div>
            </div>
        );
    }

    const {hasAllIngredients, missingIngredients} = checkMissingIngredients();
    const rating = calculateAverageRating();
    const reviewsCount = recipe.reviews ? recipe.reviews.length : 0;

    return (
        <div className="recipe-card-to-list-container" style={{width: `${width}px`, height: `${height}px`}}>
            <Card className="recipe-card-to-list" onClick={handleClick}>
                <div className="recipe-image-container">
                    <Card.Img
                        className="recipe-image"
                        src={`${BASE_URL}${recipe.image_url}`}
                        alt={recipe.name}
                    />
                </div>
                <div className="recipe-details">
                    <h2 className="recipe-name">{recipe.name}</h2>

                    <div className={`recipe-ingredients ${hasAllIngredients ? 'all-available' : 'missing'}`}>
                        {hasAllIngredients ?
                            'Всі інгредієнти в наявності' :
                            <>
                                Не вистачає: <span className="missing-ingredients">
                                                {missingIngredients.map(ing => ing.name).join(', ')}
                                            </span>
                            </>
                        }
                    </div>

                    <div className="recipe-footer">
                        <div className="recipe-time">
                            <IoTimeOutline className="time-icon"/>
                            <span>{recipe.time} хв.</span>
                        </div>
                        <div className="recipe-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={index < Math.round(rating) ? 'star-filled' : 'star-empty'}
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

export default RecipeCardToList;