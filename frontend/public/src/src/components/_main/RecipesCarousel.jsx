// Файл RecipesCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {getRecipes} from '../../utils/fetchApi/recipeApi.js';
import './RecipesCarousel.scss';
import RecipeCardMini from "../Recipe/cards/RecipeCardMini.jsx";

const RecipesCarousel = ({
                              onRecipeClick,
                              getRecipesMethod = getRecipes, // Метод по умолчанию
                              title = ""
}) => {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(6);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                console.log('Начало загрузки рецептов...');
                setLoading(true);

                const response = await getRecipesMethod();
                console.log('Ответ от сервера:', response);

                if (response && response.data) {
                    console.log('Данные рецептов получены:', response.data);
                    setRecipes(response.data);
                    console.log('Рецепты загружены. Количество:', response.data.length);
                } else {
                    console.error('Некорректный формат ответа:', response);
                    throw new Error('Некорректный формат ответа');
                }
            } catch (err) {
                console.error('Ошибка загрузки рецептов:', err);
                setError('Не удалось загрузить рецепты');
            } finally {
                console.log('Загрузка завершена.');
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Адаптивное отображение количества видимых рецептов
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newVisibleCount = 6;

            if (width < 576) {
                newVisibleCount = 2;
            } else if (width < 768) {
                newVisibleCount = 3;
            } else if (width < 992) {
                newVisibleCount = 4;
            } else if (width < 1200) {
                newVisibleCount = 5;
            } else {
                newVisibleCount = 6;
            }

            setVisibleCount(newVisibleCount);
            // Ensure startIndex is valid after resize
            setStartIndex(prev => Math.min(prev, Math.max(0, recipes.length - newVisibleCount)));
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [recipes.length]);

    const handleNext = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setStartIndex(prev => Math.min(prev + 1, Math.max(0, recipes.length - visibleCount)));

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

    if (loading) return <div className="recipes-carousel-loading">Загрузка рецептов...</div>;
    if (error) return <div className="recipes-carousel-error">{error}</div>;
    if (!recipes || recipes.length === 0) return <div className="recipes-carousel">Рецепты отсутствуют</div>;

    const showNavButtons = recipes.length > visibleCount;

    // Расчет смещения для анимации
    const translateValue = `translateX(-${startIndex * (100 / visibleCount)}%)`;

    return (
        <Container fluid className="mt-0">
            <h1 className="mb-4">{title}</h1>
            <div className="recipes-carousel">
                <div className="carousel-container">
                    {showNavButtons && (
                        <button
                            className="carousel-control carousel-control-prev"
                            onClick={handlePrev}
                            disabled={startIndex === 0 || isAnimating}
                            aria-label="Предыдущие рецепты"
                        >
                            <IoIosArrowBack />
                        </button>
                    )}

                    <div className="carousel-items">
                        <div className="recipes-wrapper" style={{
                            transform: translateValue,
                            transition: 'transform 0.3s ease-out'
                        }}>
                            {recipes.map(recipe => (
                                <div
                                    key={recipe.id}
                                    className="recipe-wrapper"
                                    style={{ width: `${100 / visibleCount}%` }}
                                >
                                    <RecipeCardMini
                                        recipe={recipe}
                                        width={200}
                                        height={350}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {showNavButtons && (
                        <button
                            className="carousel-control carousel-control-next"
                            onClick={handleNext}
                            disabled={startIndex >= recipes.length - visibleCount || isAnimating}
                            aria-label="Следующие рецепты"
                        >
                            <IoIosArrowForward />
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default RecipesCarousel;