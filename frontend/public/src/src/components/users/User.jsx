// Файл User.jsx
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './user.scss';

const User = ({ user, onClick }) => {
    const handleClick = () => {
        if (onClick && user && user.id) {
            onClick(user.id);
        }
    };

    if (!user) {
        return null;
    }

    // Явная деструктуризация с корректными именами полей
    const {
        display_name = 'Неизвестный пользователь',
        avatar_url = 'https://via.placeholder.com/100',
        id
    } = user || {};

    return (
        <div className="user-item" onClick={handleClick}>
            <Card className="user-card">
                <div className="user-image-container">
                    <Card.Img
                        variant="top"
                        src={avatar_url}
                        alt={display_name}
                        className="user-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100';
                            e.target.onerror = null;
                        }}
                    />
                </div>
                <Card.Body className="user-body">
                    <Card.Title className="user-title">{display_name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default User;
