/*
// Файл components/Reviews/ReviewsList/ReviewsList.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewsList.scss';

const ReviewsList = ({ reviews }) => {
    const renderReviews = () => {
        return reviews.map(review => (
            <div key={review.id} className="review-item">
                <div className="review-header">
                    <div className="reviewer-name">{review.user.display_name}</div>
                    <div className="review-rating">
                        {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} size={16} className="rating-star" />
                        ))}
                    </div>
                    <div className="review-date">{review.created_at}</div>
                </div>
                {review.review && (
                    <div className="review-text">{review.review}</div>
                )}
            </div>
        ));
    };

    return (
        <div className="reviews-list">
            {renderReviews()}
        </div>
    );
};

export default ReviewsList;
*/

// Файл components/Reviews/ReviewsList/ReviewsList.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './ReviewsList.scss';

const ReviewsList = ({ reviews }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} size={16} className="rating-star filled" />);
            } else {
                stars.push(<FaRegStar key={i} size={16} className="rating-star" />);
            }
        }
        return stars;
    };

    const renderReviews = () => {
        return reviews.map(review => (
            <Col key={review.id} md={6} className="review-col">
                <div className="review-item">
                    <div className="review-header">
                        <div className="reviewer-name">{review.user.display_name}</div>
                        <div className="review-rating">
                            {renderStars(review.rating)}
                        </div>
                    </div>
                    {review.review && (
                        <div className="review-text">
                            {review.review}
                        </div>
                    )}
                    <div className="review-date">{review.created_at}</div>
                </div>
            </Col>
        ));
    };

    return (
        <Row className="reviews-list">
            {renderReviews()}
        </Row>
    );
};

export default ReviewsList;