// Файл contexts/RecipeContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createLike, deleteLike } from '../utils/fetchApi/likeApi';

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
    // Состояние для хранения информации о лайках по ID рецепта
    const [recipesLikes, setRecipesLikes] = useState({});
    // Счетчик для форсирования обновления компонентов
    const [updateCounter, setUpdateCounter] = useState(0);

    // Функция для принудительного обновления компонентов
    const forceUpdate = useCallback(() => {
        setUpdateCounter(prev => prev + 1);
    }, []);

    // Функция для обновления состояния лайка конкретного рецепта
    const updateLikeStatus = useCallback(async (recipeId, userId, isLiked, likeId = null) => {
        try {
            if (isLiked) {
                // Добавление лайка
                const likeData = {
                    recipe_id: recipeId,
                    user_id: userId
                };

                // Обновляем состояние в контексте оптимистично (до получения ответа от API)
                setRecipesLikes(prev => ({
                    ...prev,
                    [recipeId]: {
                        isLiked: true,
                        likeId: 'pending' // временная метка
                    }
                }));

                // Форсируем обновление всех подписчиков контекста
                forceUpdate();

                const response = await createLike(likeData);

                // Проверяем формат ответа и извлекаем ID
                let newLikeId = null;

                // Проверка разных возможных форматов ответа
                if (response && response.data) {
                    // Если ID находится в response.data.id
                    if (response.data.id) {
                        newLikeId = response.data.id;
                    }
                    // Если response.data сам является объектом с id
                    else if (typeof response.data === 'object') {
                        newLikeId = response.data.id;
                    }
                } else if (response && response.id) {
                    // Если ID находится непосредственно в response.id
                    newLikeId = response.id;
                }

                if (!newLikeId) {
                    console.error('Не удалось извлечь ID из ответа API:', response);
                    console.log('Полный ответ API:', JSON.stringify(response));
                }

                // Обновляем состояние в контексте с ID из ответа или генерируем временный ID
                setRecipesLikes(prev => ({
                    ...prev,
                    [recipeId]: {
                        isLiked: true,
                        likeId: newLikeId || `temp-${Date.now()}`
                    }
                }));

                // Форсируем обновление снова
                forceUpdate();

                console.log('Создан лайк с ID:', newLikeId);
                return newLikeId;
            } else if (likeId) {
                console.log('Удаляем лайк с ID:', likeId);

                // Оптимистично обновляем UI перед запросом к API
                setRecipesLikes(prev => ({
                    ...prev,
                    [recipeId]: {
                        isLiked: false,
                        likeId: null
                    }
                }));

                // Форсируем обновление всех подписчиков контекста
                forceUpdate();

                // Удаление лайка
                await deleteLike(likeId);

                // На всякий случай форсируем обновление еще раз
                forceUpdate();
            }
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);

            // В случае ошибки восстанавливаем предыдущее состояние
            setRecipesLikes(prev => ({
                ...prev,
                [recipeId]: {
                    isLiked: !isLiked,
                    likeId: isLiked ? null : likeId
                }
            }));

            forceUpdate();
            throw error;
        }
    }, [forceUpdate]);

    // Функция для проверки состояния лайка
    const checkLikeStatus = useCallback((recipe, userId) => {
        if (!recipe || !userId) return { isLiked: false, likeId: null };

        // Проверяем в контексте
        if (recipesLikes[recipe.id] !== undefined) {
            return recipesLikes[recipe.id];
        }

        // Проверяем в данных рецепта
        if (recipe.likes && Array.isArray(recipe.likes)) {
            const userLike = recipe.likes.find(like => like.user_id === userId);
            if (userLike) {
                // Убеждаемся, что у лайка есть корректный ID
                if (!userLike.id) {
                    console.error('Лайк не имеет ID:', userLike);
                    return { isLiked: false, likeId: null };
                }

                // Обновляем контекст и возвращаем результат
                const result = { isLiked: true, likeId: userLike.id };
                setRecipesLikes(prev => ({
                    ...prev,
                    [recipe.id]: result
                }));

                return result;
            }
        }

        // Если лайк не найден, сохраняем это состояние в контексте
        setRecipesLikes(prev => ({
            ...prev,
            [recipe.id]: { isLiked: false, likeId: null }
        }));

        return { isLiked: false, likeId: null };
    }, [recipesLikes]);

    const value = {
        recipesLikes,
        updateLikeStatus,
        checkLikeStatus,
        updateCounter
    };

    return (
        <RecipesContext.Provider value={value}>
            {children}
        </RecipesContext.Provider>
    );
};

export const useRecipes = () => {
    const context = useContext(RecipesContext);
    if (!context) {
        throw new Error('useRecipes must be used within a RecipesProvider');
    }
    return context;
};
