// Файл components/Reviews/Reviews.jsx
import React, { useState } from 'react';
import ReviewForm from './ReviewForm/ReviewForm';
import ReviewsList from './ReviewsList/ReviewsList';
import './Reviews.scss';

const Reviews = ({ recipeId, initialReviews, onRecipeUpdate }) => {
    const [reviews, setReviews] = useState(initialReviews || []);

    const handleReviewAdded = (newReview) => {
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);

        // Вызываем колбэк для обновления данных рецепта
        if (onRecipeUpdate) {
            onRecipeUpdate();
        }
    };

    return (
        <div className="reviews-container">
            <ReviewForm
                recipeId={recipeId}
                onReviewAdded={handleReviewAdded}
            />
            <ReviewsList reviews={reviews} />
        </div>
    );
};

export default Reviews;
