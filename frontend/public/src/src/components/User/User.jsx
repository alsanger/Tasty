// Файл User.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { BASE_URL } from '../../utils/constants';
import './User.scss';
import defaultAvatar from '../../assets/images/defaultAvatar.png';

const User = ({ user, onClick }) => {
    if (!user) {
        return null;
    }

    const handleClick = () => {
        if (onClick) {
            onClick(user.id);
        } else {
            console.log(`Clicked on user: ${user.display_name} (ID: ${user.id})`);
        }
    };

    return (
        <div className="user-item" onClick={handleClick}>
            <Card className="user-card">
                <div className="user-image-container">
                    <Card.Img
                        variant="top"
                        src={`${BASE_URL}${user.avatar_url}`}
                        alt={user.display_name}
                        className="user-image"
                        onError={(e) => {
                            console.error(`Ошибка загрузки аватара пользователя: ${user.display_name}`);
                            e.target.src = defaultAvatar;
                            e.target.onerror = null;
                        }}
                    />
                </div>
                <Card.Body className="user-body">
                    <Card.Title className="user-title">{user.display_name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default User;
