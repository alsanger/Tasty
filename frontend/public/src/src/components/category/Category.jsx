// Файл Category.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { BASE_URL } from '../../utils/constants';
import './Category.scss';
import defaultAvatar from '../../assets/images/defaultAvatar.png';

const Category = ({ category, onClick }) => {
    if (!category) {
        return null;
    }

    const handleClick = () => {
        if (onClick) {
            onClick(category.id);
        } else {
            console.log(`Clicked on category: ${category.name} (ID: ${category.id})`);
        }
    };

    return (
        <div className="category-item" onClick={handleClick}>
            <Card className="category-card">
                <div className="category-image-container">
                    <Card.Img
                        variant="top"
                        src={`${BASE_URL}${category.image_url}`}
                        alt={category.name}
                        className="category-image"
                        onError={(e) => {
                            console.error(`Ошибка загрузки изображения в компоненте: ${category.name}`);
                            e.target.src = defaultAvatar;
                            e.target.onerror = null;
                        }}
                    />
                </div>
                <Card.Body className="category-body">
                    <Card.Title className="category-title">{category.name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Category;
