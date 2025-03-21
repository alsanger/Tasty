// Файл components/_profilePage/ProfileHeader/ProfileHeader.jsx
import React from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from '../../_common/Button/Button';
import backgroundImage from '../../../assets/images/profileImage.jpg';
import './ProfileHeader.scss';
import {BASE_URL} from "../../../utils/constants.js";

const ProfileHeader = ({userData, currentUserId}) => {
    // Проверяем, свой ли профиль просматривает пользователь
    const isOwnProfile = userData.id === currentUserId;

    // Обработчики для кнопок и ссылок
    const handleButtonClick = () => {
        if (isOwnProfile) {
            console.log('Редактирование профиля');
        } else {
            console.log('Подписка на пользователя', userData.id);
        }
    };

    const handleFollowersClick = () => {
        console.log('Переход на страницу подписчиков');
    };

    const handleFollowingClick = () => {
        console.log('Переход на страницу подписок');
    };

    return (
        <div className="profile-header">
            <div
                className="profile-background"
                style={{backgroundImage: `url(${backgroundImage})`}}
            />

            <Container className="profile-content">
                <Row className="justify-content-center">
                    <Col xs="auto" className="text-center">
                        <div className="avatar-container">
                            <Image
                                src={`${BASE_URL}${userData.avatar_url}`}
                                roundedCircle
                                className="profile-avatar"
                                alt={`${userData.first_name} ${userData.last_name}`}
                            />
                        </div>

                        <div className="profile-info">
                            <p className="profile-name">{`${userData.first_name} ${userData.last_name}`}</p>
                            <p className="display-name">{userData.display_name}</p>

                        <div className="followers-section">
                            <span>{userData.followers.total} </span>
                            <span onClick={handleFollowersClick} className="follow-link">
                                <span>Підписники</span>
                            </span>
                            <span className="separator">•</span>
                            <span>{userData.following.total} </span>
                            <span onClick={handleFollowingClick} className="follow-link">
                                <span>Підписки</span>
                            </span>
                        </div>

                        <Button
                            text={isOwnProfile ? "Редагувати профіль" : "Підписатися"}
                            onClick={handleButtonClick}
                            isActive={!isOwnProfile}
                        />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

ProfileHeader.propTypes = {
    userData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired,
        avatar_url: PropTypes.string.isRequired,
        followers: PropTypes.shape({
            total: PropTypes.number.isRequired,
            data: PropTypes.array.isRequired
        }).isRequired,
        following: PropTypes.shape({
            total: PropTypes.number.isRequired,
            data: PropTypes.array.isRequired
        }).isRequired
    }).isRequired,
    currentUserId: PropTypes.number.isRequired
};

export default ProfileHeader;