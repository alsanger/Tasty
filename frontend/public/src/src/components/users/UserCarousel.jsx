// Файл UserCarousel.scss
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import User from './User.jsx';
import { getUsers } from '../../utils/fetchApi/userApi';
import './UserCarousel.scss';

const UserCarousel = ({ onUserClick }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Загрузка пользователей с API
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

    // Адаптивное отображение количества видимых пользователей
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
            // Ensure startIndex is valid after resize
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

        // Сбросить флаг анимации после завершения перехода
        setTimeout(() => {
            setIsAnimating(false);
        }, 300); // Время должно совпадать с продолжительностью анимации в CSS
    };

    const handlePrev = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setStartIndex(prev => Math.max(0, prev - 1));

        // Сбросить флаг анимации после завершения перехода
        setTimeout(() => {
            setIsAnimating(false);
        }, 300); // Время должно совпадать с продолжительностью анимации в CSS
    };

    if (loading) return <div className="user-carousel-loading">Загрузка пользователей...</div>;
    if (error) return <div className="user-carousel-error">{error}</div>;
    if (!users || users.length === 0) return <div className="user-carousel">Пользователи отсутствуют</div>;

    const visibleUsers = users.slice(startIndex, startIndex + visibleCount);
    const showNavButtons = users.length > visibleCount;

    // Расчет смещения для анимации
    const translateValue = `translateX(-${startIndex * (100 / visibleCount)}%)`;

    return (
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
                    <div className="users-wrapper" style={{
                        transform: translateValue,
                        transition: 'transform 0.3s ease-out'
                    }}>
                        {users.map(user => (
                            <div
                                key={user.id}
                                className="user-wrapper"
                                style={{ width: `${100 / visibleCount}%` }}
                            >
                                <User
                                    user={user}
                                    onClick={onUserClick}
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
    );
};

export default UserCarousel;