// Файл components/RecipeFilterSidebar/RecipeFilterSidebar.jsx
/*
import React, { useState, useEffect, useRef } from 'react';
import { Accordion } from 'react-bootstrap';
import TimeFilter from './components/TimeFilter';
import CaloriesFilter from './components/CaloriesFilter';
import DifficultyFilter from './components/DifficultyFilter';
import IngredientFilter from './components/IngredientFilter';
import AuthorFilter from './components/AuthorFilter';
import CuisineFilter from './components/CuisineFilter';
import CookingMethodFilter from './components/CookingMethodFilter';
import './RecipeFilterSidebar.scss';

const RecipeFilterSidebar = ({ initialFilters = {}, onFilterChange }) => {
    const [filters, setFilters] = useState({
        min_time: initialFilters.min_time || null,
        max_time: initialFilters.max_time || null,
        min_calories: initialFilters.min_calories || '',
        max_calories: initialFilters.max_calories || '',
        difficulty_min: initialFilters.difficulty_min || 1,
        difficulty_max: initialFilters.difficulty_max || 10,
        ingredients_include: initialFilters.ingredients_include || [],
        ingredients_exclude: initialFilters.ingredients_exclude || [],
        user_id: initialFilters.user_id || [],
        countries: initialFilters.countries || [],
        cooking_methods: initialFilters.cooking_methods || []
    });

    // Используем useRef для отслеживания изменений initialFilters
    const initialFiltersRef = useRef(initialFilters);
    // Флаг для предотвращения вызова onFilterChange при первом рендере
    const isFirstRender = useRef(true);
    // Флаг для предотвращения лишних обновлений из-за изменения initialFilters
    const isUpdatingFromProps = useRef(false);

    // Обновляем состояние при изменении initialFilters
    useEffect(() => {
        if (JSON.stringify(initialFiltersRef.current) !== JSON.stringify(initialFilters)) {
            console.log("⚡ Обнаружены изменения в initialFilters:", initialFilters);
            initialFiltersRef.current = initialFilters;
            isUpdatingFromProps.current = true;
            setFilters({
                min_time: initialFilters.min_time || null,
                max_time: initialFilters.max_time || null,
                min_calories: initialFilters.min_calories || '',
                max_calories: initialFilters.max_calories || '',
                difficulty_min: initialFilters.difficulty_min || 1,
                difficulty_max: initialFilters.difficulty_max || 10,
                ingredients_include: initialFilters.ingredients_include || [],
                ingredients_exclude: initialFilters.ingredients_exclude || [],
                user_id: initialFilters.user_id || [],
                countries: initialFilters.countries || [],
                cooking_methods: initialFilters.cooking_methods || []
            });
        }
    }, [initialFilters]);

    // Используем useEffect для уведомления родительского компонента о смене фильтров
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isUpdatingFromProps.current) {
            isUpdatingFromProps.current = false;
            return;
        }

        console.log("📢 Фильтры обновлены:", filters);
        if (onFilterChange) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange]);

    const updateFilter = (key, value) => {
        console.log(`🛠 Обновление фильтра ${key}:`, value);
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTimeChange = (time) => {
        updateFilter('max_time', time);
    };

    const handleCaloriesChange = (name, value) => {
        updateFilter(name, value);
    };

    const handleDifficultyChange = (min, max) => {
        updateFilter('difficulty_min', min);
        updateFilter('difficulty_max', max);
    };

    const handleIngredientsIncludeChange = (ingredients) => {
        updateFilter('ingredients_include', ingredients);
    };

    const handleIngredientsExcludeChange = (ingredients) => {
        updateFilter('ingredients_exclude', ingredients);
    };

    const handleAuthorsChange = (authors) => {
        updateFilter('user_id', authors);
    };

    const handleCuisinesChange = (cuisines) => {
        updateFilter('countries', cuisines);
    };

    const handleCookingMethodsChange = (methods) => {
        updateFilter('cooking_methods', methods);
    };

    return (
        <div className="recipe-filter-sidebar">
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Час приготування</Accordion.Header>
                    <Accordion.Body>
                        <TimeFilter
                            selectedTime={filters.max_time}
                            onChange={handleTimeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Калорійність</Accordion.Header>
                    <Accordion.Body>
                        <CaloriesFilter
                            minCalories={filters.min_calories}
                            maxCalories={filters.max_calories}
                            onChange={handleCaloriesChange}
                            showOkButton={true}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Складність приготування</Accordion.Header>
                    <Accordion.Body>
                        <DifficultyFilter
                            minDifficulty={filters.difficulty_min}
                            maxDifficulty={filters.difficulty_max}
                            onChange={handleDifficultyChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Наявні інгредієнти</Accordion.Header>
                    <Accordion.Body>
                        <IngredientFilter
                            title="present"
                            selectedIngredients={filters.ingredients_include}
                            onChange={handleIngredientsIncludeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                    <Accordion.Header>Відсутні інгредієнти</Accordion.Header>
                    <Accordion.Body>
                        <IngredientFilter
                            title="absent"
                            selectedIngredients={filters.ingredients_exclude}
                            onChange={handleIngredientsExcludeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                    <Accordion.Header>Пошук по автору</Accordion.Header>
                    <Accordion.Body>
                        <AuthorFilter
                            selectedAuthors={filters.user_id}
                            onChange={handleAuthorsChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                    <Accordion.Header>Кухні світу</Accordion.Header>
                    <Accordion.Body>
                        <CuisineFilter
                            selectedCuisines={filters.countries}
                            onChange={handleCuisinesChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                    <Accordion.Header>Спосіб приготування</Accordion.Header>
                    <Accordion.Body>
                        <CookingMethodFilter
                            selectedMethods={filters.cooking_methods}
                            onChange={handleCookingMethodsChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default RecipeFilterSidebar;*/

// Файл components/RecipeFilterSidebar/RecipeFilterSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Accordion } from 'react-bootstrap';
import TimeFilter from './components/TimeFilter';
import CaloriesFilter from './components/CaloriesFilter';
import DifficultyFilter from './components/DifficultyFilter';
import IngredientFilter from './components/IngredientFilter';
import AuthorFilter from './components/AuthorFilter';
import CuisineFilter from './components/CuisineFilter';
import CookingMethodFilter from './components/CookingMethodFilter';
import './RecipeFilterSidebar.scss';

const RecipeFilterSidebar = ({ initialFilters = {}, onFilterChange }) => {
    const [filters, setFilters] = useState({
        name: initialFilters.name || '',
        min_time: initialFilters.min_time || null,
        max_time: initialFilters.max_time || null,
        min_calories: initialFilters.min_calories || '',
        max_calories: initialFilters.max_calories || '',
        difficulty_min: initialFilters.difficulty_min || 1,
        difficulty_max: initialFilters.difficulty_max || 10,
        ingredients_include: initialFilters.ingredients_include || [],
        ingredients_exclude: initialFilters.ingredients_exclude || [],
        user_id: initialFilters.user_id || [],
        countries: initialFilters.countries || [],
        cooking_methods: initialFilters.cooking_methods || []
    });

    // Используем useRef для отслеживания изменений initialFilters
    const initialFiltersRef = useRef(initialFilters);
    // Флаг для предотвращения вызова onFilterChange при первом рендере
    const isFirstRender = useRef(true);
    // Флаг для предотвращения лишних обновлений из-за изменения initialFilters
    const isUpdatingFromProps = useRef(false);

    // Обновляем состояние при изменении initialFilters
    useEffect(() => {
        if (JSON.stringify(initialFiltersRef.current) !== JSON.stringify(initialFilters)) {
            console.log("⚡ Обнаружены изменения в initialFilters:", initialFilters);
            initialFiltersRef.current = initialFilters;
            isUpdatingFromProps.current = true;
            setFilters({
                name: initialFilters.name || '',
                min_time: initialFilters.min_time || null,
                max_time: initialFilters.max_time || null,
                min_calories: initialFilters.min_calories || '',
                max_calories: initialFilters.max_calories || '',
                difficulty_min: initialFilters.difficulty_min || 1,
                difficulty_max: initialFilters.difficulty_max || 10,
                ingredients_include: initialFilters.ingredients_include || [],
                ingredients_exclude: initialFilters.ingredients_exclude || [],
                user_id: initialFilters.user_id || [],
                countries: initialFilters.countries || [],
                cooking_methods: initialFilters.cooking_methods || []
            });
        }
    }, [initialFilters]);

    // Используем useEffect для уведомления родительского компонента о смене фильтров
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isUpdatingFromProps.current) {
            isUpdatingFromProps.current = false;
            return;
        }

        console.log("📢 Фильтры обновлены:", filters);
        if (onFilterChange) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange]);

    const updateFilter = (key, value) => {
        console.log(`🛠 Обновление фильтра ${key}:`, value);
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTimeChange = (time) => {
        updateFilter('max_time', time);
    };

    const handleCaloriesChange = (name, value) => {
        updateFilter(name, value);
    };

    const handleDifficultyChange = (min, max) => {
        updateFilter('difficulty_min', min);
        updateFilter('difficulty_max', max);
    };

    const handleIngredientsIncludeChange = (ingredients) => {
        updateFilter('ingredients_include', ingredients);
    };

    const handleIngredientsExcludeChange = (ingredients) => {
        updateFilter('ingredients_exclude', ingredients);
    };

    const handleAuthorsChange = (authors) => {
        updateFilter('user_id', authors);
    };

    const handleCuisinesChange = (cuisines) => {
        updateFilter('countries', cuisines);
    };

    const handleCookingMethodsChange = (methods) => {
        updateFilter('cooking_methods', methods);
    };

    return (
        <div className="recipe-filter-sidebar">
            {/* Отображаем информацию о поиске по названию, если оно задано */}
            {/*{filters.name && (
                <div className="search-info-banner mb-3 p-2">
                    <p className="m-0">Поиск по названию: <strong>{filters.name}</strong></p>
                </div>
            )}*/}

            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Час приготування</Accordion.Header>
                    <Accordion.Body>
                        <TimeFilter
                            selectedTime={filters.max_time}
                            onChange={handleTimeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Калорійність</Accordion.Header>
                    <Accordion.Body>
                        <CaloriesFilter
                            minCalories={filters.min_calories}
                            maxCalories={filters.max_calories}
                            onChange={handleCaloriesChange}
                            showOkButton={true}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Складність приготування</Accordion.Header>
                    <Accordion.Body>
                        <DifficultyFilter
                            minDifficulty={filters.difficulty_min}
                            maxDifficulty={filters.difficulty_max}
                            onChange={handleDifficultyChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Наявні інгредієнти</Accordion.Header>
                    <Accordion.Body>
                        <IngredientFilter
                            title="present"
                            selectedIngredients={filters.ingredients_include}
                            onChange={handleIngredientsIncludeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                    <Accordion.Header>Відсутні інгредієнти</Accordion.Header>
                    <Accordion.Body>
                        <IngredientFilter
                            title="absent"
                            selectedIngredients={filters.ingredients_exclude}
                            onChange={handleIngredientsExcludeChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                    <Accordion.Header>Пошук по автору</Accordion.Header>
                    <Accordion.Body>
                        <AuthorFilter
                            selectedAuthors={filters.user_id}
                            onChange={handleAuthorsChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                    <Accordion.Header>Кухні світу</Accordion.Header>
                    <Accordion.Body>
                        <CuisineFilter
                            selectedCuisines={filters.countries}
                            onChange={handleCuisinesChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                    <Accordion.Header>Спосіб приготування</Accordion.Header>
                    <Accordion.Body>
                        <CookingMethodFilter
                            selectedMethods={filters.cooking_methods}
                            onChange={handleCookingMethodsChange}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default RecipeFilterSidebar;
