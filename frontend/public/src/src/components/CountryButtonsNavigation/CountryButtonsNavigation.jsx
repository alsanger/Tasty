import React, { useEffect, useState } from "react";
import {Container} from 'react-bootstrap';
import Button from "../_common/Button/Button.jsx"; // Подключаем ваш кастомный компонент кнопки
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
        <Container fluid className="mt-3">
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
        </Container>
    );
};

export default CountryButtonsNavigation;
