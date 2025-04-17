// Файл components/_profilePage/ProfileHeader/ProfileHeader.jsx
import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {RxAvatar} from 'react-icons/rx'; // Добавляем импорт RxAvatar
import Button from '../../_common/Button/Button';
import backgroundImage from '../../../assets/images/profileImage.jpg';
import './ProfileHeader.scss';
import {BASE_URL} from "../../../utils/constants.js";
import {followUser, unfollowUser} from '../../../utils/fetchApi/followerApi';
import {logout} from "../../../utils/fetchApi/userApi.js";
import {useUser} from "../../../contexts/UserContext.jsx";
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({userData, currentUserId}) => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useUser();
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
            navigate(`/edit-profile`);
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

    /*const logoutButtonClick = async () => {
        try {
            await logout();
            console.log('Выход из профиля');
            //window.location.reload(); // Полная перезагрузка страницы. Или можно сделать редирект на главную страницу или страницу входа
        } catch (error) {
            console.error('Ошибка при выходе из профиля:', error);
        }
    };*/
    const logoutButtonClick = async () => {
        try {
            // 1. Выполняем выход
            await logout();

            // 2. Очищаем клиентское состояние
            localStorage.clear(); // Очищаем localStorage (если там есть токен)
            sessionStorage.clear(); // Аналогично для sessionStorage

            // 3. Сбрасываем кеш запросов
            if (window.queryClient) {
                queryClient.clear();
            }

            // 4. Перенаправляем на главную
            window.location.href = '/'; // Или '/login' если нужно

        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    // Определяем текст кнопки
    const buttonText = isOwnProfile
        ? "Редагувати профіль"
        : (isFollowing ? "Відписатися" : "Підписатися");

    // Определяем активность кнопки - только "Підписатися" должна быть активной
    const buttonIsActive = !isOwnProfile && !isFollowing;

    // Проверяем наличие аватарки у пользователя
    const hasAvatar = userData.avatar_url && userData.avatar_url !== '';

    // Формируем строку имени пользователя, отображая только существующие имя и фамилию
    const renderName = () => {
        const firstName = userData.first_name && userData.first_name.trim() !== '' ? userData.first_name : '';
        const lastName = userData.last_name && userData.last_name.trim() !== '' ? userData.last_name : '';

        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else if (firstName) {
            return firstName;
        } else if (lastName) {
            return lastName;
        } else {
            return ''; // Возвращаем пустую строку, если имя и фамилия отсутствуют
        }
    };

    const displayName = renderName();

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
                            {hasAvatar ? (
                                <Image
                                    src={`${BASE_URL}${userData.avatar_url}`}
                                    roundedCircle
                                    className="profile-avatar"
                                    alt={displayName || userData.display_name}
                                />
                            ) : (
                                <div className="default-avatar-container">
                                    <RxAvatar size={105} className="profile-avatar"/>
                                </div>
                            )}
                        </div>

                        <div className="profile-info">
                            {displayName && <p className="profile-name">{displayName}</p>}
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

                            {isAuthenticated && user && (
                                <Button
                                    className="button"
                                    text={buttonText}
                                    onClick={handleButtonClick}
                                    isActive={buttonIsActive}
                                />
                            )}

                            {isAuthenticated && user && isOwnProfile && (
                            <Button
                                className="button"
                                text="Вийти з профілю"
                                onClick={logoutButtonClick}
                                isActive={false}
                            />
                            )}
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
        first_name: PropTypes.string,  // Может отсутствовать
        last_name: PropTypes.string,   // Может отсутствовать
        display_name: PropTypes.string.isRequired,
        avatar_url: PropTypes.string,  // Может отсутствовать
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