import React from 'react';
import CountryButtonsNavigation from "./CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import ImageUploader from "./ImageUploader.jsx";
import './Main.scss';
import CategoryExample from "../category/CategoryExample.jsx";
import CategoryCarousel from "../category/CategoryCarousel.jsx";


function Main() {
    return (
        <div className="site-main">
            <CountryButtonsNavigation />
            <p>Это основное содержимое твоего приложения.</p>
            <h2>Загрузка аватара</h2>
            <ImageUploader type="avatar" id={10} />
            {/*<CategoryExample />*/}
            <CategoryCarousel />

            {/* <h2>Загрузка изображения рецепта</h2>
            <ImageUploader type="recipe" id={1} /> */}

            {/* <h2>Загрузка изображения шага рецепта</h2>
            <ImageUploader type="recipe" id={1} recipeStepId={2} /> */}
        </div>
    );
}

export default Main;
