// Файл components/_profilePage/UserProfileRecipes/UserProfileRecipes.jsx
import React, { useState, useEffect } from 'react';
import { Spinner, Pagination } from 'react-bootstrap';
import RecipeCardMini from '../../Recipe/cards/RecipeCardMini';
import { searchRecipes } from '../../../utils/fetchApi/recipeApi';
import { getLikesByUserId } from '../../../utils/fetchApi/likeApi';
import { useUser } from '../../../contexts/UserContext';
import './UserProfileRecipes.scss';

const UserProfileRecipes = ({ userData, currentUserId }) => {
    const isOwnProfile = userData?.id === currentUserId;

    const [activeTab, setActiveTab] = useState('publications');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData();
    }, [activeTab, currentUserId, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (activeTab === 'publications') {
                // Получаем опубликованные рецепты
                const response = await searchRecipes({
                    user_id: [userData?.id],
                    page: currentPage
                }, 'POST');

                setRecipes(response.data);
                setTotalPages(response.meta.last_page);
            } else if (isOwnProfile) {
                // Получаем лайкнутые рецепты только для своего профиля
                const response = await getLikesByUserId(currentUserId);

                // Преобразуем данные лайков в формат рецептов
                const likedRecipes = response.data.map(item => item.recipe);
                setRecipes(likedRecipes);
                setTotalPages(response.meta.last_page);
            }
        } catch (err) {
            console.error('Ошибка при загрузке рецептов:', err);
            setError('Не вдалося завантажити рецепти');
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setCurrentPage(1); // Сбрасываем страницу при смене вкладки
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Компонент пагинации
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <div className="pagination-container">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    />
                    {items}
                    <Pagination.Next
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        );
    };

    return (
        <div className="user-profile-recipes">
            <div className="tabs-container">
                {isOwnProfile ? (
                    <div className="profile-tabs">
                        <div
                            className={`tab ${activeTab === 'publications' ? 'active' : ''}`}
                            onClick={() => handleTabClick('publications')}
                        >
                            Публікації
                        </div>
                        <div
                            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => handleTabClick('saved')}
                        >
                            Збережені
                        </div>
                    </div>
                ) : (
                    <div className="publications-title">Публікації</div>
                )}
            </div>

            <div className="recipes-content">
                {loading ? (
                    <div className="loading-container">
                        <p>Завантаження рецептів...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="empty-container">
                        <p>Рецепти відсутні</p>
                    </div>
                ) : (
                    <>
                        <div className="recipes-grid">
                            {recipes.map(recipe => (
                                <div key={recipe.id} className="recipe-card-wrapper">
                                    <RecipeCardMini
                                        recipe={recipe}
                                        width={300}
                                        height={320}
                                    />
                                </div>
                            ))}
                        </div>
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfileRecipes;