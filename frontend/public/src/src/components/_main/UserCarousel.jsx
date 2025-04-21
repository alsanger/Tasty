// Файл UserCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import User from '../User/User.jsx';
import { getUsers } from '../../utils/fetchApi/userApi.js';
import './UserCarousel.scss';
import { FONT_FAMILIES } from "../../utils/constants.js";

const UserCarousel = ({ onUserClick }) => {
    const navigate = useNavigate();
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleUserClick = (user) => {
        if (onUserClick) {
            console.log(`Вызов внешней функции onUserClick с ID: ${user?.id}`);
            onUserClick(user?.id);
        } else {
            navigate(`/recipes?authors=${user?.id}`);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getUsers();

                if (response && response.data) {
                    setUsers(response.data);
                    console.log('Пользователи загружены:', response.data.length);
                } else {
                    throw new Error('Некорректный формат ответа');
                }
            } catch (err) {
                console.error('Ошибка загрузки пользователей:', err);
                setError('Не удалось загрузить пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newVisibleCount = 5;

            if (width < 576) {
                newVisibleCount = 1;
            } else if (width < 768) {
                newVisibleCount = 3;
            } else if (width < 992) {
                newVisibleCount = 6;
            } else if (width < 1200) {
                newVisibleCount = 7;
            } else {
                newVisibleCount = 8;
            }

            setVisibleCount(newVisibleCount);
            setStartIndex(prev => Math.min(prev, Math.max(0, users.length - newVisibleCount)));
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [users.length]);

    const handleNext = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setStartIndex(prev => Math.min(prev + 1, Math.max(0, users.length - visibleCount)));

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const handlePrev = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setStartIndex(prev => Math.max(0, prev - 1));

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    if (loading) return <div className="user-carousel-loading">Загрузка пользователей...</div>;
    if (error) return <div className="user-carousel-error">{error}</div>;
    if (!users || users.length === 0) return <div className="user-carousel">Пользователи отсутствуют</div>;

    const visibleUsers = users.slice(startIndex, startIndex + visibleCount);
    const showNavButtons = users.length > visibleCount;
    const translateValue = `translateX(-${startIndex * (100 / visibleCount)}%)`;

    return (
        <Container fluid className="mt-3">
            <h1 className="mb-4">Популярні автори</h1>
            <div className="user-carousel">
                <div className="carousel-container">
                    {showNavButtons && (
                        <button
                            className="carousel-control carousel-control-prev"
                            onClick={handlePrev}
                            disabled={startIndex === 0 || isAnimating}
                            aria-label="Предыдущие пользователи"
                        >
                            <IoIosArrowBack />
                        </button>
                    )}

                    <div className="carousel-items">
                        <div
                            className="users-wrapper"
                            style={{
                                transform: translateValue,
                                transition: 'transform 0.3s ease-out'
                            }}
                        >
                            {users.map(user => (
                                <div
                                    key={user?.id}
                                    className="user-wrapper"
                                    style={{ width: `${100 / visibleCount}%` }}
                                >
                                    <User
                                        user={user}
                                        onClick={() => handleUserClick(user)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {showNavButtons && (
                        <button
                            className="carousel-control carousel-control-next"
                            onClick={handleNext}
                            disabled={startIndex >= users.length - visibleCount || isAnimating}
                            aria-label="Следующие пользователи"
                        >
                            <IoIosArrowForward />
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default UserCarousel;