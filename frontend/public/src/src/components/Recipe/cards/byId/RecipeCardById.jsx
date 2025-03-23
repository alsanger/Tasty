/*
// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeartOutline } from "react-icons/io5";
import { getRecipeById } from '../../../../utils/fetchApi/recipeApi.js';
import './RecipeCardById.scss';
import {BASE_URL, FONT_FAMILIES} from "../../../../utils/constants.js";

const RecipeCardById = ({
                        recipeId,
                        showAuthor = false,
                        featuredText = '',
                        onClick,
                        name = null
                    }) => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div className="recipe-card-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-card-container d-flex justify-content-center align-items-center">
                <div className="text-center text-muted">
                    {error || 'Рецепт не найден'}
                </div>
            </div>
        );
    }

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
                        <div className="recipe-featured">
                            <IoHeartOutline className="recipe-featured-icon" />
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

export default RecipeCardById;*/


// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { getRecipeById } from '../../../../utils/fetchApi/recipeApi.js';
import { createLike, deleteLike } from '../../../../utils/fetchApi/likeApi.js';
import { useUser } from '../../../../contexts/UserContext.jsx';
import './RecipeCardById.scss';
import { BASE_URL, FONT_FAMILIES } from "../../../../utils/constants.js";

const RecipeCardById = ({
                            recipeId,
                            showAuthor = false,
                            featuredText = '',
                            onClick,
                            name = null,
                            onLikeChange = () => {}
                        }) => {
    const { user, isAuthenticated } = useUser();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [likeId, setLikeId] = useState(null);

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
            onClick(recipe.id);
        } else if (recipe) {
            console.log(`Clicked on recipe: ${recipe.name} (ID: ${recipe.id})`);
        }
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки

        // Если пользователь не авторизован, выходим из функции
        if (!isAuthenticated || !user) {
            // Можно добавить редирект на страницу логина или показать сообщение
            return;
        }

        setIsLikeLoading(true);

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
            setIsLikeLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="recipe-card-container d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-card-container d-flex justify-content-center align-items-center">
                <div className="text-center text-muted">
                    {error || 'Рецепт не найден'}
                </div>
            </div>
        );
    }

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
                            {isLikeLoading ? (
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

export default RecipeCardById;