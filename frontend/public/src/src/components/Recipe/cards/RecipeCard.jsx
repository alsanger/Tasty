// Файл components/Recipe/cards/recipeCard.jsx:
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import './RecipeCard.scss';
import { BASE_URL } from "../../../utils/constants.js";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../../contexts/UserContext.jsx';
import { useRecipeLikes } from '../../../hooks/useRecipeLikes.jsx';

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
    const { isFavorite, isLoading, toggleLike } = useRecipeLikes(recipe, onLikeChange);

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

    const handleFavoriteClick = (e) => {
        toggleLike(e);
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