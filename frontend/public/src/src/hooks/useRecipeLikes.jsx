// Файл hooks/useRecipeLikes.jsx
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useModal } from '../contexts/ModalContext';
import { useRecipes } from '../contexts/RecipesContext';

export const useRecipeLikes = (recipe, onLikeChange = () => {}) => {
    const { user, isAuthenticated } = useUser();
    const { showModal } = useModal();
    const { checkLikeStatus, updateLikeStatus, updateCounter } = useRecipes();
    const [isFavorite, setIsFavorite] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Проверяем состояние лайка через контекст
    // Добавляем updateCounter в зависимости, чтобы компонент реагировал на изменения в контексте
    useEffect(() => {
        if (isAuthenticated && recipe && user) {
            const { isLiked, likeId: currentLikeId } = checkLikeStatus(recipe, user.id);
            setIsFavorite(isLiked);
            setLikeId(currentLikeId);
            console.log(`[useEffect ${updateCounter}] Состояние лайка для рецепта ${recipe.id}: ${isLiked ? 'лайкнут' : 'не лайкнут'}, ID лайка: ${currentLikeId}`);
        } else {
            setIsFavorite(false);
            setLikeId(null);
        }
    }, [recipe, user, isAuthenticated, checkLikeStatus, updateCounter]); // Добавляем updateCounter в зависимости

    const toggleLike = async (e) => {
        if (e) e.stopPropagation(); // Предотвращаем срабатывание onClick всей карточки

        // Если пользователь не авторизован, открываем модальное окно логина
        if (!isAuthenticated || !user) {
            showModal('login');
            return;
        }

        setIsLoading(true);

        try {
            // Инвертируем текущее состояние
            const newLikeState = !isFavorite;

            console.log(`Переключаем лайк для рецепта ${recipe.id}, новое состояние: ${newLikeState}, текущий ID лайка: ${likeId}`);

            // Оптимистично обновляем UI
            setIsFavorite(newLikeState);

            // Обновляем лайк через контекст (и в БД)
            const newLikeId = await updateLikeStatus(recipe.id, user.id, newLikeState, likeId);

            // Обновляем ID лайка если создан новый
            if (newLikeState && newLikeId) {
                setLikeId(newLikeId);
                console.log(`Установлен новый ID лайка: ${newLikeId}`);
            } else {
                setLikeId(null);
            }

            // Вызываем колбэк для обновления родительского компонента если нужно
            onLikeChange(recipe.id, newLikeState);
        } catch (error) {
            console.error('Ошибка при обработке лайка:', error);
            // Возвращаем предыдущее состояние в случае ошибки
            setIsFavorite(!isFavorite);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isFavorite,
        isLoading,
        toggleLike
    };
};
