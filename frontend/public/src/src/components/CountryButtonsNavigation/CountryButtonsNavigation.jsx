import React, { useEffect, useState } from "react";
import Button from "../common/Button/Button.jsx"; // Подключаем ваш кастомный компонент кнопки
import { getCountries } from "../../utils/fetchApi/countryApi.js";
import { get, post } from "../../utils/fetchApi/baseApi.js";
import { ENDPOINTS } from "../../utils/constants.js";
import { GiChefToque } from "react-icons/gi";
import "./CountryButtonsNavigation.scss";

const CountryButtonsNavigation = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countryList = await getCountries();
                console.log("Ответ сервера getCountries:", countryList);
                setCountries(countryList.data.slice(0, 10)); // Ограничиваем 10 странами
            } catch (error) {
                console.error("Ошибка загрузки стран:", error);
            }
        };

        fetchCountries();
    }, []);

    // Запрос для кнопки "Всі рецепти"
    const fetchAllRecipes = async () => {
        try {
            const response = await get(ENDPOINTS.RECIPES);
            console.log("Все рецепты:", response);
        } catch (error) {
            console.error("Ошибка загрузки всех рецептов:", error);
        }
    };

    // Запрос для кнопки страны
    const fetchRecipesByCountry = async (countryId) => {
        try {
            const response = await post(ENDPOINTS.SEARCH_RECIPES, {
                countries: [countryId],
            });
            console.log(`Рецепты для страны ${countryId}:`, response);
        } catch (error) {
            console.error(`Ошибка загрузки рецептов для страны ${countryId}:`, error);
        }
    };

    return (
        <div className="country-buttons-nav">
            <Button
                text="Всі рецепти"
                icon={GiChefToque}
                isActive={true}
                onClick={fetchAllRecipes}
            />

            {/* Кнопки стран */}
            {countries.map((country) => (
                <Button
                    key={country.id}
                    text={country.name}
                    onClick={() => fetchRecipesByCountry(country.id)}
                />
            ))}
        </div>
    );
};

export default CountryButtonsNavigation;





/*
import React, { useState } from 'react';
import Buttons from '../../common/Buttons/Buttons';
import { GiChefToque } from 'react-icons/gi';

const CountryButtonsNavigation = () => {
    const [activeCountry, setActiveCountry] = useState('all');

    const navigationButtons = [
        {
            id: 'all',
            text: 'Всі рецепти',
            icon: GiChefToque,
            variant: 'default',
            onClick: () => setActiveCountry('all'),
            isActive: activeCountry === 'all'
        },
        {
            id: 'ukraine',
            text: 'Україна',
            variant: 'default',
            onClick: () => setActiveCountry('ukraine'),
            isActive: activeCountry === 'ukraine'
        },
        {
            id: 'italy',
            text: 'Італія',
            variant: 'default',
            onClick: () => setActiveCountry('italy'),
            isActive: activeCountry === 'italy'
        },
        {
            id: 'france',
            text: 'Франція',
            variant: 'default',
            onClick: () => setActiveCountry('france'),
            isActive: activeCountry === 'france'
        },
        {
            id: 'mexico',
            text: 'Мексика',
            variant: 'default',
            onClick: () => setActiveCountry('mexico'),
            isActive: activeCountry === 'mexico'
        },
        {
            id: 'asia',
            text: 'Азія',
            variant: 'default',
            onClick: () => setActiveCountry('asia'),
            isActive: activeCountry === 'asia'
        },
        {
            id: 'america',
            text: 'Америка',
            variant: 'default',
            onClick: () => setActiveCountry('america'),
            isActive: activeCountry === 'america'
        },
        {
            id: 'germany',
            text: 'Німеччина',
            variant: 'default',
            onClick: () => setActiveCountry('germany'),
            isActive: activeCountry === 'germany'
        },
        {
            id: 'georgia',
            text: 'Грузія',
            variant: 'default',
            onClick: () => setActiveCountry('georgia'),
            isActive: activeCountry === 'georgia'
        },
        {
            id: 'turkey',
            text: 'Туреччина',
            variant: 'default',
            onClick: () => setActiveCountry('turkey'),
            isActive: activeCountry === 'turkey'
        }
    ];

    return (
        <Buttons
            buttons={navigationButtons}
            className="p-4"
        />
    );
};

export default CountryButtonsNavigation;*/
