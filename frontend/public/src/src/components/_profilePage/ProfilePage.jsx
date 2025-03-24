// Файл components/_profilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import { getUserById } from '../../utils/fetchApi/userApi';
import { useUser } from '../../contexts/UserContext';
import './ProfilePage.scss';
import UserProfileRecipes from "./UserProfileRecipes/UserProfileRecipes.jsx";

const ProfilePage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id);
                setUserData(response.data);
            } catch (err) {
                console.error('Ошибка при загрузке данных пользователя:', err);
                setError('Не вдалося завантажити дані користувача');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    if (loading) {
        return (
            <Container className="profile-page-container loading-container">
                <div className="text-center">
                    <Spinner animation="border" role="status" variant="primary" />
                    <p className="mt-3">Завантаження...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="profile-page-container error-container">
                <div className="text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </Container>
        );
    }

    if (!userData) {
        return (
            <Container className="profile-page-container error-container">
                <div className="text-center">
                    <p>Користувача не знайдено</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="profile-page-container">
            <ProfileHeader
                userData={userData}
                currentUserId={user?.id}
            />
            <UserProfileRecipes
                userData={userData}
                currentUserId={user?.id}
            />
            {/* Здесь будут добавлены другие компоненты профиля в будущем */}
        </Container>
    );
};

export default ProfilePage;