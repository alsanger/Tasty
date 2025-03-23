/*
// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {IoHeart, IoHeartOutline} from "react-icons/io5";
import './RecipeCard.scss';
import { BASE_URL } from "../../../utils/constants.js";
import {useNavigate} from "react-router-dom";

const RecipeCard = ({
                        recipe,
                        showAuthor = false,
                        featuredText = '',
                        onClick,
                        name = null
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
                state: { recipe },  // Передаем recipe в state
            });
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="recipe-card-container">
            <Card className="recipe-card" onClick={handleClick}>
                <div className="recipe-image-container">
                    <Card.Img
                        className="recipe-image"
                        src={`${BASE_URL}${recipe.image_url}`}

                        alt={name || recipe.name}
                    />

                    {featuredText && (
                        <div className="recipe-featured" onClick={handleFavoriteClick}>
                            {isFavorite ? <IoHeart className="recipe-featured-icon active" /> : <IoHeartOutline className="recipe-featured-icon" />}
                            <span>{featuredText}</span>
                        </div>
                    )}

                    <div className="recipe-content">
                        <h1 className="recipe-name">{name || recipe.name}</h1>

                        {showAuthor && recipe.user && (
                            <div className="recipe-author">
                                {recipe.user.avatar_url && (
                                    <img
                                        src={`${BASE_URL}${recipe.user.avatar_url}`}
                                        alt={recipe.user.display_name}
                                        className="author-avatar"
                                    />
                                )}
                                <span className="author-name">{recipe.user.display_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RecipeCard;*/


// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import './RecipeCard.scss';
import { BASE_URL } from "../../../utils/constants.js";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../../contexts/UserContext.jsx';
import { createLike, deleteLike } from '../../../utils/fetchApi/likeApi.js';

const RecipeCard = ({
                        recipe,
                        showAuthor = false,
                        featuredText = '',
                        onClick,
                        name = null,
                        onLikeChange = () => {}
                    }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [likeId, setLikeId] = useState(null);

    // Проверяем, лайкнул ли текущий пользователь рецепт и сохраняем ID лайка
    useEffect(() => {
        if (recipe?.likes && user) {
            const userLike = recipe.likes.find(like => like.user_id === user.id);
            if (userLike) {
                setIsFavorite(true);
                setLikeId(userLike.id);
            } else {
                setIsFavorite(false);
                setLikeId(null);
            }
        }
    }, [recipe, user]);

    const handleClick = () => {
        if (onClick && recipe) {
            console.log(`Вызов внешней функции onClick с ID: ${recipe.id}`);
            onClick(recipe.id);
        } else if (recipe) {
            console.log(`Navigating to recipe page with ID: ${recipe.id}`);
            navigate(`/recipe/${recipe.id}`, {
                state: { recipe },
            });
        }
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки

        // Если пользователь не авторизован, выходим из функции
        if (!isAuthenticated || !user) {
            // Можно добавить редирект на страницу логина или показать сообщение
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite && likeId) {
                // Удаляем лайк, используя сохраненный ID лайка
                await deleteLike(likeId);
                setLikeId(null);
            } else {
                // Добавляем лайк
                const likeData = {
                    recipe_id: recipe.id,
                    user_id: user.id
                };
                const response = await createLike(likeData);

                // Предполагаем, что ответ содержит ID созданного лайка
                if (response && response.id) {
                    setLikeId(response.id);
                }
            }

            // Обновляем состояние после успешного запроса
            setIsFavorite(!isFavorite);

            // Вызываем колбэк для обновления родительского компонента, если он предоставлен
            onLikeChange(recipe.id, !isFavorite);

        } catch (error) {
            console.error('Ошибка при обработке лайка:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="recipe-card-container">
            <Card className="recipe-card" onClick={handleClick}>
                <div className="recipe-image-container">
                    <Card.Img
                        className="recipe-image"
                        src={`${BASE_URL}${recipe.image_url}`}
                        alt={name || recipe.name}
                    />

                    {featuredText && (
                        <div className="recipe-featured" onClick={handleFavoriteClick}>
                            {isLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                isFavorite ?
                                    <IoHeart className="recipe-featured-icon active" /> :
                                    <IoHeartOutline className="recipe-featured-icon" />
                            )}
                            <span>{featuredText}</span>
                        </div>
                    )}

                    <div className="recipe-content">
                        <h1 className="recipe-name">{name || recipe.name}</h1>

                        {showAuthor && recipe.user && (
                            <div className="recipe-author">
                                {recipe.user.avatar_url && (
                                    <img
                                        src={`${BASE_URL}${recipe.user.avatar_url}`}
                                        alt={recipe.user.display_name}
                                        className="author-avatar"
                                    />
                                )}
                                <span className="author-name">{recipe.user.display_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RecipeCard;