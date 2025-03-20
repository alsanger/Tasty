// Файл components/Recipe/cards/RecipeCardMini.jsx
import React, {useState} from 'react';
import {Card} from 'react-bootstrap';
import {IoHeartOutline, IoHeart, IoTimeOutline} from "react-icons/io5";
import {FaStar} from "react-icons/fa";
import './RecipeCardMini.scss';
import {BASE_URL} from "../../../utils/constants.js";
import {useNavigate} from "react-router-dom";

const RecipeCardMini = ({
                                    recipe,
                                    onClick,
                                    width = 200,
                                    height = 350,
                                }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    const handleClick = () => {
        if (onClick && recipe) {
            console.log(`Вызов внешней функции onClick с ID: ${recipe.id}`);
            onClick(recipe.id);
        } else if (recipe) {
            console.log(`Navigating to recipe page with ID: ${recipe.id}`);
            // Переходим на страницу рецепта, передавая рецепт через state
            navigate(`/recipe/${recipe.id}`, {
                state: {recipe},  // Передаем recipe в state
            });
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

    if (!recipe) {
        return (
            <div className="recipe-card-horizontal-container d-flex justify-content-center align-items-center">
                <div className="text-center text-muted">
                    {'Рецепт не найден'}
                </div>
            </div>
        );
    }

    const rating = calculateAverageRating();
    const reviewsCount = recipe.reviews ? recipe.reviews.length : 0;
    const ingredientsList = getIngredientsList();

    return (
        <div className="recipe-card-horizontal-container" style={{ width: `${width}px`, height: `${height}px` }}>
            <Card className="recipe-card-horizontal" onClick={handleClick}>
                <div className="recipe-image-container">
                    <Card.Img
                        className="recipe-image"
                        src={`${BASE_URL}${recipe.image_url}`}
                        alt={recipe.name}
                    />
                    <div className="favorite-button" onClick={handleFavoriteClick}>
                        {isFavorite ? <IoHeart className="favorite-icon active"/> :
                            <IoHeartOutline className="favorite-icon"/>}
                    </div>
                </div>
                <div className="recipe-details">
                    <h2 className="recipe-name">{recipe.name}</h2>
                    <p className="recipe-ingredients">
                        {ingredientsList}
                    </p>
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

export default RecipeCardMini;