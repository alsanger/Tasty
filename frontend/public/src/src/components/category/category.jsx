// Файл category.jsx
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './category.scss';

const Category = ({ category, onClick }) => {
    // Добавляем логирование при монтировании
    useEffect(() => {
        console.log(`Category компонент смонтирован: ${category.name}`);
        console.log(`Путь к изображению: ${category.image_url}`);

        // Проверим, загружается ли изображение
        const img = new Image();
        img.onload = () => console.log(`✅ Изображение для ${category.name} загрузилось успешно`);
        img.onerror = () => console.error(`❌ Ошибка загрузки изображения для ${category.name}`);
        img.src = category.image_url;
    }, [category]);

    const handleClick = () => {
        if (onClick) {
            onClick(category.id);
        } else {
            console.log(`Clicked on category: ${category.name} (ID: ${category.id})`);
        }
    };

    if (!category) {
        return null;
    }

    return (
        <div className="category-item" onClick={handleClick}>
            <Card className="category-card">
                <div className="category-image-container">
                    {/* Добавим фолбэк в случае ошибки загрузки изображения */}
                    <Card.Img
                        variant="top"
                        src={category.image_url}
                        alt={category.name}
                        className="category-image"
                        onError={(e) => {
                            console.error(`Ошибка загрузки изображения в компоненте: ${category.name}`);
                            e.target.src = 'https://via.placeholder.com/100';
                            e.target.onerror = null;
                        }}
                    />
                </div>
                <Card.Body className="category-body">
                    <Card.Title className="category-title">{category.name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Category;





/*
// Файл category.jsx
import React from 'react';
import { Card } from 'react-bootstrap';
import './category.scss';

/!**
 * Компонент Category для отображения категории рецептов
 * @param {Object} props - Свойства компонента
 * @param {Object} props.category - Объект категории с полями id, name, image_url
 * @param {Function} props.onClick - Функция обработки клика по категории
 *!/
const Category = ({ category, onClick }) => {
    const handleClick = () => {
        // Вызываем переданную функцию onClick с id категории
        if (onClick) {
            onClick(category.id);
        } else {
            // Временное решение: просто логируем id категории
            console.log(`Clicked on category: ${category.name} (ID: ${category.id})`);
            // TODO: В будущем здесь будет навигация на страницу с фильтрацией по категории
        }
    };

    // Проверка наличия данных категории
    if (!category) {
        return null;
    }

    return (
        <div className="category-item" onClick={handleClick}>
            <Card className="category-card">
                <div className="category-image-container">
                    <Card.Img
                        variant="top"
                        src={category.image_url}
                        alt={category.name}
                        className="category-image"
                    />
                </div>
                <Card.Body className="category-body">
                    <Card.Title className="category-title">{category.name}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Category;*/
