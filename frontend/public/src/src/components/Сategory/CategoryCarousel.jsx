// Файл CategoryCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom'; // Добавлен импорт useNavigate
import Category from './Category.jsx';
import { getCategories } from '../../utils/fetchApi/categoryApi';
import './CategoryCarousel.scss';

const CategoryCarousel = ({ onCategoryClick }) => {
  const navigate = useNavigate(); // Добавлен хук для навигации
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      console.log(`Вызов внешней функции onCategoryClick с ID: ${category?.id}`); // Исправлено
      onCategoryClick(category?.id);
    } else {
      console.log(`Navigating to recipes with category ID: ${category?.id}`); // Добавлен лог
      navigate(`/recipes?categories=${category?.id}`); // Исправлено
    }
  };

  // Загрузка категорий с API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();

        if (response && response.data) {
          setCategories(response.data);
          console.log('Категории загружены:', response.data.length);
        } else {
          throw new Error('Некорректный формат ответа');
        }
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Адаптивное отображение количества видимых категорий
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
      setStartIndex(prev => Math.min(prev, Math.max(0, categories.length - newVisibleCount)));
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [categories.length]);

  const handleNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setStartIndex(prev => Math.min(prev + 1, Math.max(0, categories.length - visibleCount)));

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

  if (loading) return <div className="category-carousel-loading">Загрузка категорий...</div>;
  if (error) return <div className="category-carousel-error">{error}</div>;
  if (!categories || categories.length === 0) return <div className="category-carousel">Категории отсутствуют</div>;

  const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);
  const showNavButtons = categories.length > visibleCount;

  // Расчет смещения для анимации
  const translateValue = `translateX(-${startIndex * (100 / visibleCount)}%)`;

  return (
      <Container fluid className="mt-0">
        <div className="category-carousel">
          <div className="carousel-container">
            {showNavButtons && (
                <button
                    className="carousel-control carousel-control-prev"
                    onClick={handlePrev}
                    disabled={startIndex === 0 || isAnimating}
                    aria-label="Предыдущие категории"
                >
                  <IoIosArrowBack />
                </button>
            )}

            <div className="carousel-items">
              <div className="categories-wrapper" style={{
                transform: translateValue,
                transition: 'transform 0.3s ease-out'
              }}>
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="category-wrapper"
                        style={{ width: `${100 / visibleCount}%` }}
                    >
                      <Category
                          category={category}
                          onClick={() => handleCategoryClick(category)} // Изменено на handleCategoryClick
                      />
                    </div>
                ))}
              </div>
            </div>

            {showNavButtons && (
                <button
                    className="carousel-control carousel-control-next"
                    onClick={handleNext}
                    disabled={startIndex >= categories.length - visibleCount || isAnimating}
                    aria-label="Следующие категории"
                >
                  <IoIosArrowForward />
                </button>
            )}
          </div>
        </div>
      </Container>
  );
};

export default CategoryCarousel;
