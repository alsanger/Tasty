// Файл components/CountryButtonsNavigation/CountryButtonsNavigation.jsx
import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Button from "../_common/Button/Button.jsx";
import { getCountries } from "../../utils/fetchApi/countryApi.js";
import { useNavigate } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import { preferredCountries } from "../../utils/constants.js";
import "./CountryButtonsNavigation.scss";

const CountryButtonsNavigation = () => {
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await getCountries();
                let allCountries = response.data;

                const preferred = [];
                const others = [];

                allCountries.forEach((country) => {
                    if (preferredCountries.includes(country.name)) {
                        preferred.push(country);
                    } else {
                        others.push(country);
                    }
                });

                // Сортировка приоритетных стран в заданном порядке
                preferred.sort((a, b) =>
                    preferredCountries.indexOf(a.name) - preferredCountries.indexOf(b.name)
                );

                // Остальные по алфавиту
                others.sort((a, b) => a.name.localeCompare(b.name));

                // Объединяем и ограничиваем 10 странами
                const sortedCountries = [...preferred, ...others].slice(0, 10);
                setCountries(sortedCountries);
            } catch (error) {
                console.error("Ошибка загрузки стран:", error);
            }
        };

        fetchCountries();
    }, []);

    const navigateToAllRecipes = () => {
        navigate('/recipes');
    };

    const navigateToCountryRecipes = (countryId, countryName) => {
        navigate(`/recipes?countries=${countryId}`);
    };

    return (
        <Container fluid className="mt-3">
            <div className="country-buttons-nav">
                <Button
                    text="Всі рецепти"
                    icon={GiChefToque}
                    isActive={true}
                    onClick={navigateToAllRecipes}
                />

                {countries.map((country) => (
                    <Button
                        key={country.id}
                        text={country.name}
                        onClick={() => navigateToCountryRecipes(country.id, country.name)}
                    />
                ))}
            </div>
        </Container>
    );
};

export default CountryButtonsNavigation;


/*import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Button from "../_common/Button/Button.jsx";
import { getCountries } from "../../utils/fetchApi/countryApi.js";
import { useNavigate } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import "./CountryButtonsNavigation.scss";

const CountryButtonsNavigation = () => {
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countryList = await getCountries();
                console.log("Ответ сервера getCountries:", countryList);
                setCountries(countryList.data.slice(0, 10));
            } catch (error) {
                console.error("Ошибка загрузки стран:", error);
            }
        };

        fetchCountries();
    }, []);

    const navigateToAllRecipes = () => {
        navigate('/recipes');
    };

    const navigateToCountryRecipes = (countryId, countryName) => {
        navigate(`/recipes?countries=${countryId}`);
    };

    return (
        <Container fluid className="mt-3">
            <div className="country-buttons-nav">
                <Button
                    text="Всі рецепти"
                    icon={GiChefToque}
                    isActive={true}
                    onClick={navigateToAllRecipes}
                />

                {countries.map((country) => (
                    <Button
                        key={country.id}
                        text={country.name}
                        onClick={() => navigateToCountryRecipes(country.id, country.name)}
                    />
                ))}
            </div>
        </Container>
    );
};

export default CountryButtonsNavigation;*/
