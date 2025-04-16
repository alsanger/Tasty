// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { getRecipeById } from '../../../../utils/fetchApi/recipeApi.js';
import { useUser } from '../../../../contexts/UserContext.jsx';
import { useRecipeLikes } from '../../../../hooks/useRecipeLikes.jsx';
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
    const { isFavorite, isLoading, toggleLike } = useRecipeLikes(recipe, onLikeChange);

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
        toggleLike(e);
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