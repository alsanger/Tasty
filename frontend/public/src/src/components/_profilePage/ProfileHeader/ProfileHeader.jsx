// Файл components/_profilePage/ProfileHeader/ProfileHeader.jsx
import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from '../../_common/Button/Button';
import backgroundImage from '../../../assets/images/profileImage.jpg';
import './ProfileHeader.scss';
import {BASE_URL} from "../../../utils/constants.js";
import { followUser, unfollowUser } from '../../../utils/fetchApi/followerApi';

const ProfileHeader = ({userData, currentUserId}) => {
    // Проверяем, свой ли профиль просматривает пользователь
    const isOwnProfile = userData.id === currentUserId;

    // Состояние для отслеживания статуса подписки
    const [isFollowing, setIsFollowing] = useState(false);

    // Локальное состояние для количества подписчиков
    const [followersCount, setFollowersCount] = useState(userData.followers.total);

    // Проверяем, подписан ли текущий пользователь на владельца профиля
    useEffect(() => {
        if (!isOwnProfile) {
            const isCurrentUserFollower = userData.followers.data.some(
                follower => follower.id === currentUserId
            );
            setIsFollowing(isCurrentUserFollower);
        }
        setFollowersCount(userData.followers.total);
    }, [userData, currentUserId, isOwnProfile]);

    // Обработчик для кнопки
    const handleButtonClick = async () => {
        if (isOwnProfile) {
            console.log('Редактирование профиля');
            // Здесь будет редирект на страницу редактирования профиля
        } else {
            try {
                if (isFollowing) {
                    // Отписаться от пользователя
                    await unfollowUser(currentUserId, userData.id);
                    setIsFollowing(false);
                    // Уменьшаем количество подписчиков
                    setFollowersCount(prevCount => prevCount - 1);
                    console.log('Отписался от пользователя', userData.id);
                } else {
                    // Подписаться на пользователя
                    await followUser(currentUserId, userData.id);
                    setIsFollowing(true);
                    // Увеличиваем количество подписчиков
                    setFollowersCount(prevCount => prevCount + 1);
                    console.log('Подписался на пользователя', userData.id);
                }
            } catch (error) {
                console.error('Ошибка при изменении статуса подписки:', error);
            }
        }
    };

    const handleFollowersClick = () => {
        console.log('Переход на страницу подписчиков');
    };

    const handleFollowingClick = () => {
        console.log('Переход на страницу подписок');
    };

    // Определяем текст кнопки
    const buttonText = isOwnProfile
        ? "Редагувати профіль"
        : (isFollowing ? "Відписатися" : "Підписатися");

    // Определяем активность кнопки - только "Підписатися" должна быть активной
    const buttonIsActive = !isOwnProfile && !isFollowing;

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
                                <span>{followersCount} </span>
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
                                text={buttonText}
                                onClick={handleButtonClick}
                                isActive={buttonIsActive}
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