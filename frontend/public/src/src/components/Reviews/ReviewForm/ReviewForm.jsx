// Файл components/Reviews/ReviewsForm/ReviewsForm.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import { post } from '../../../utils/fetchApi/baseApi';
import { ENDPOINTS } from '../../../utils/constants';
import { useUser } from '../../../contexts/UserContext';
import './ReviewForm.scss';

const ReviewForm = ({ recipeId, onReviewAdded }) => {
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStarHover = (currentRating) => {
        setHoverRating(currentRating);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const handleStarClick = (currentRating) => {
        setRating(currentRating);
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
                <FaStar
                    key={index}
                    size={20}
                    color={currentRating <= (hoverRating || rating) ? '#FFD700' : '#e4e5e9'}
                    onMouseEnter={() => handleStarHover(currentRating)}
                    onMouseLeave={handleStarLeave}
                    onClick={() => handleStarClick(currentRating)}
                    className="star-icon"
                />
            );
        });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Будь ласка, увійдіть в систему');
            return;
        }

        if (rating === 0) {
            alert('Будь ласка, виберіть рейтинг');
            return;
        }

        setIsSubmitting(true);

        try {
            const reviewData = {
                recipe_id: recipeId,
                user_id: user.id,
                rating: rating,
                review: reviewText
            };

            const response = await post(ENDPOINTS.CREATE_REVIEW, reviewData);

            onReviewAdded(response.data);

            setRating(0);
            setReviewText('');
        } catch (error) {
            console.error('Помилка при надсиланні відгуку:', error);
            alert('Не вдалося надіслати відгук. Перевте інтернет-з\'єднання.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="review-form">
            <div className="star-rating">
                {renderStars()}
            </div>
            <h3>&nbsp;Відгуки</h3>
            <Form onSubmit={handleSubmitReview} className="review-input-form">
                <Form.Group className="review-input-group">
                    <Form.Control
                        as="textarea"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Напишіть свій відгук..."
                        className="review-textarea"
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        variant="link"
                        className="send-review-btn"
                        disabled={isSubmitting}
                    >
                        <LuSend size={24} />
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export default ReviewForm;