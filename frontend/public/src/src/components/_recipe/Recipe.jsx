// Файл components/Recipe/Recipe.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { LuMessageSquareMore } from 'react-icons/lu';
import { BASE_URL } from "../../utils/constants.js";
import './Recipe.scss';
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Reviews from "../Reviews/Reviews.jsx";
import { getRecipeById } from '../../utils/fetchApi/recipeApi.js';
import Button from "../_common/Button/Button.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { updateCookingPlan, getUserCookingPlans } from '../../utils/fetchApi/cookingPlanApi.js';
import { useRecipeLikes } from '../../hooks/useRecipeLikes.jsx';

const Recipe = () => {
    const location = useLocation();
    const [recipe, setRecipe] = useState(location.state?.recipe || null);
    const [isAddingToPlan, setIsAddingToPlan] = useState(false);
    const [isInPlan, setIsInPlan] = useState(false);
    const [userPlan, setUserPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isAuthenticated } = useUser();
    const navigate = useNavigate();

    // Загрузка рецепта если его нет в состоянии
    useEffect(() => {
        if (!recipe && location.pathname.includes('/recipe/')) {
            const recipeId = location.pathname.split('/').pop();
            if (recipeId) {
                setIsLoading(true);
                getRecipeById(recipeId)
                    .then(response => {
                        setRecipe(response.data);
                    })
                    .catch(error => {
                        console.error('Ошибка при загрузке рецепта:', error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        }
    }, [location, recipe]);

    // Обновление данных рецепта
    const updateRecipeData = async () => {
        if (!recipe?.id) return null;

        setIsLoading(true);
        try {
            const response = await getRecipeById(recipe.id);
            setRecipe(response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении данных рецепта:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Колбэк для обновления после изменения лайка
    const handleLikeChange = async () => {
        console.log(`Лайк изменен для рецепта ${recipe?.id}`);
        // Здесь не вызываем updateRecipeData, так как обновление состояния
        // уже происходит оптимистично в хуке useRecipeLikes
    };

    // Используем хук для управления лайками
    const { isFavorite, isLoading: isLikeLoading, toggleLike } = useRecipeLikes(recipe, handleLikeChange);

    // Проверка наличия плана пользователя
    useEffect(() => {
        if (isAuthenticated && user?.id && recipe?.id) {
            checkIfRecipeInPlan();
        }
    }, [isAuthenticated, user, recipe]);

    if (!recipe && isLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    if (!recipe) {
        return <p>Рецепт не найден!</p>;
    }

    // Функция для проверки, находится ли рецепт в плане приготовления
    const checkIfRecipeInPlan = async () => {
        try {
            const response = await getUserCookingPlans(user.id);

            if (response.data && response.data.length > 0) {
                const plan = response.data[0];
                setUserPlan(plan);

                const recipeInPlan = plan.recipes?.some(item => item.id === recipe.id);
                setIsInPlan(recipeInPlan);
            } else {
                setUserPlan(null);
                setIsInPlan(false);
            }
        } catch (error) {
            console.error('Ошибка при получении планов пользователя:', error);
        }
    };

    // Обработчик клика по кнопке лайка
    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        toggleLike(e);
    };

    // Обработчик клика по автору
    const handleAuthorClick = () => {
        navigate(`/profile/${recipe.user.id}`, {
            state: { user },
        });
    };

    // Функция для обработки добавления рецепта в план приготовления
    const handleAddToPlanClick = async () => {
        // Проверяем, авторизован ли пользователь
        if (!isAuthenticated || !user?.id) {
            console.error('Пользователь не авторизован');
            return;
        }
        // Проверяем, если уже в плане — ничего не делаем
        if (isInPlan) return;

        setIsAddingToPlan(true);

        try {
            // Проверяем наличие плана
            if (!userPlan) {
                console.error('Отсутствует план пользователя');
                return;
            }

            // Получаем список существующих рецептов
            const existingRecipes = userPlan.recipes || [];

            // Формируем массив для отправки на сервер
            const recipesToUpdate = [
                ...existingRecipes.map(item => ({ recipe_id: item.id })),
                { recipe_id: recipe.id } // Добавляем новый рецепт
            ];

            // Формируем данные для запроса с сохранением всех рецептов
            const planData = {
                user_id: user.id,
                recipes: recipesToUpdate
            };

            // Отправляем запрос на обновление плана
            const response = await updateCookingPlan(userPlan.id, planData);

            // Обновляем состояние - рецепт теперь в плане
            setIsInPlan(true);

            // Обновляем план в состоянии
            await checkIfRecipeInPlan();

        } catch (error) {
            console.error('Ошибка при добавлении рецепта в план:', error);
            if (error.response) {
                console.error('Данные ответа:', error.response.data);
                console.error('Статус:', error.response.status);
            }
        } finally {
            setIsAddingToPlan(false);
        }
    };

    // Функция для форматирования числового значения
    const formatQuantity = (quantity) => {
        if (quantity === undefined || quantity === null) return '';

        const num = parseFloat(quantity);
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toString().replace(/\.?0+$/, '');
    };

    // Расчет калорийности на 100г продукта
    const calculateCaloriesPer100g = () => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;

        let totalCalories = 0;
        let totalWeight = 0;

        recipe.ingredients.forEach(ingredient => {
            const calories = parseFloat(ingredient.calories);
            const quantity = parseFloat(ingredient.quantity);

            if (!isNaN(calories) && !isNaN(quantity)) {
                totalCalories += calories * quantity;
                totalWeight += quantity;
            }
        });

        return totalWeight > 0 ? Math.round(totalCalories / totalWeight * 100) : 0;
    };

    const caloriesPer100g = calculateCaloriesPer100g();

    // Расчет среднего рейтинга
    const calculateAverageRating = () => {
        if (!recipe.reviews || recipe.reviews.length === 0) return 0;

        const sum = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / recipe.reviews.length;
    };

    const averageRating = calculateAverageRating();

    // Отображение звездочек рейтинга
    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<FaStar key={i} className="star-icon"/>);
            } else if (i - 0.5 === roundedRating) {
                stars.push(<FaStarHalfAlt key={i} className="star-icon"/>);
            } else {
                stars.push(<FaRegStar key={i} className="star-icon"/>);
            }
        }

        return stars;
    };

    // Проверка наличия шагов рецепта
    const hasSteps = recipe.recipeSteps && recipe.recipeSteps.length > 0;

    // Сортировка шагов по номеру
    const sortedSteps = hasSteps
        ? [...recipe.recipeSteps].sort((a, b) => a.step_number - b.step_number)
        : [];

    return (
        <Container fluid className="recipe-container">
            {isLoading && (
                <div className="text-center my-3">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
                </div>
            )}
            <Row>
                <Col md={6} className="recipe-image-col">
                    <div className="image-container">
                        <Image src={`${BASE_URL}${recipe.image_url}`} alt={recipe.name} fluid/>
                        <button
                            className="favorite-btn"
                            onClick={handleFavoriteClick}
                        >
                            {isLikeLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                isFavorite ?
                                    <IoHeart className="heart-icon filled"/> :
                                    <IoHeartOutline className="heart-icon"/>
                            )}
                        </button>
                    </div>

                    {/* RecipeSteps section */}
                    {hasSteps && (
                        <div className="recipe-steps">
                            {sortedSteps.map((step) => (
                                <div key={step.id} className="recipe-step-item">
                                    <div className="recipe-step-content">
                                        <div className="recipe-step-number">{step.step_number}</div>
                                        <div className="recipe-step-description">{step.description}</div>
                                    </div>
                                    {step.image_url && (
                                        <div className="recipe-step-image">
                                            <img
                                                src={`${BASE_URL}${step.image_url}`}
                                                alt={`Шаг ${step.step_number}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Col>
                <Col md={6} className="recipe-info-col">
                    <div className="recipe-info">
                        <h1 className="recipe-title">{recipe.name}</h1>
                        <p className="recipe-description">{recipe.description}</p>

                        <h3 className="ingredients-title">Інгредієнти</h3>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id} className="ingredient-item">
                                    <span className="ingredient-name">{ingredient.name}</span>
                                    <span className="ingredient-dots"></span>
                                    <span className="ingredient-quantity">
                                        {formatQuantity(ingredient.quantity)} {ingredient.short_name}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="recipe-meta">
                            <p className="author-label">
                                Автор рецепту:{' '}
                                <span className="author-name" onClick={handleAuthorClick}>
                                {recipe.user.display_name}
                            </span>
                            </p>
                            <p className="recipe-time">
                                Час приготування: <span>{recipe.time} хв.</span>
                            </p>
                            <p className="recipe-calories">
                                Калорійність (на 100 гр. продукту): <span>{caloriesPer100g} ккал.</span>
                            </p>
                            <div className="recipe-rating">
                                <span className="review-count">{recipe.reviews.length}</span>
                                <LuMessageSquareMore className="message-icon"/>
                                <span className="rating-stars">
                                    {renderStars(averageRating)}
                                </span>
                            </div>
                        </div>

                        {/* Кнопка добавления в план - показываем только для авторизованных пользователей */}
                        {isAuthenticated && user && (
                            <div className="add-to-plan-button">
                                {isAddingToPlan ? (
                                    <Spinner animation="border" size="sm" role="status">
                                        <span className="visually-hidden">Загрузка...</span>
                                    </Spinner>
                                ) : (
                                    <Button
                                        text={isInPlan ? "Заплановано до приготування" : "Запланувати приготування"}
                                        onClick={handleAddToPlanClick}
                                        isActive={!isInPlan} // isActive=true если рецепта еще нет в плане
                                        size="sm"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="recipe-reviews-section">
                <Col>
                    <Reviews
                        recipeId={recipe.id}
                        initialReviews={recipe.reviews}
                        onRecipeUpdate={updateRecipeData}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Recipe;