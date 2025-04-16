import React, { useState, useEffect } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import RecipeCardToList from '../Recipe/cards/RecipeCardToList';
import { getUserCookingPlans, updateCookingPlan } from '../../utils/fetchApi/cookingPlanApi';
import { useUser } from '../../contexts/UserContext';
import './CookingPlanList.scss';

const CookingPlanList = ({ fridgeIngredients }) => {
    const { user } = useUser();
    const [cookingPlan, setCookingPlan] = useState(null);
    const [plannedRecipes, setPlannedRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка планов пользователя
    useEffect(() => {
        const fetchUserCookingPlans = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await getUserCookingPlans(user.id);

                if (response.data && response.data.length > 0) {
                    setCookingPlan(response.data[0]); // Берем первый план
                    setPlannedRecipes(response.data[0].recipes || []);
                } else {
                    setCookingPlan(null);
                    setPlannedRecipes([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке планов приготовления:', error);
                toast.error('Помилка при завантаженні планів приготування');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserCookingPlans();
    }, [user]);

    // Удаление рецепта из плана
    const handleDeleteRecipe = async (recipeId) => {
        if (!cookingPlan) return;

        try {
            // Отфильтровываем удаляемый рецепт
            const updatedRecipes = plannedRecipes.filter(recipe => recipe.id !== recipeId);
            setPlannedRecipes(updatedRecipes);

            // Подготавливаем данные для обновления
            const updateData = {
                user_id: user.id,
                recipes: updatedRecipes.map(recipe => ({ recipe_id: recipe.id }))
            };

            // Обновляем план в базе данных
            await updateCookingPlan(cookingPlan.id, updateData);
            toast.success('Рецепт видалено з плану приготування');
        } catch (error) {
            console.error('Ошибка при удалении рецепта из плана:', error);
            toast.error('Помилка при видаленні рецепта з плану');

            // Возвращаем исходное состояние при ошибке
            const response = await getUserCookingPlans(user.id);
            if (response.data && response.data.length > 0) {
                setPlannedRecipes(response.data[0].recipes || []);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="cooking-plan-loading">
                Завантаження...
            </div>
        );
    }

    return (
        <div className="cooking-plan-list">
            <p className="panel-title">Заплановано до приготування</p>
            <div className="plan-recipes-container">
                {plannedRecipes.length > 0 ? (
                    plannedRecipes.map((recipe) => (
                        <div className="recipe-item" key={recipe.id}>
                            <RecipeCardToList
                                recipe={recipe}
                                fridgeIngredients={fridgeIngredients}
                                width={550}
                                height={130}
                            />
                            <button
                                className="delete-recipe-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRecipe(recipe.id);
                                }}
                                aria-label="Видалити рецепт"
                            >
                                <RiDeleteBinLine />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-plan-message">
                        Ваш кулінарний план поки що порожній. Додавайте рецепти, творіть смачно — і нехай кожен прийом їжі буде святом!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CookingPlanList;