import React from 'react';
import CountryButtonsNavigation from "./CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import ImageUploader from "./ImageUploader.jsx";
import './Main.scss';


function Main() {
    return (
        <div className="site-main">
            <CountryButtonsNavigation />
            <p>Это основное содержимое твоего приложения.</p>
            <h2>Загрузка аватара</h2>
            <ImageUploader type="avatar" id={10} />

            {/* <h2>Загрузка изображения рецепта</h2>
            <ImageUploader type="recipe" id={1} /> */}

            {/* <h2>Загрузка изображения шага рецепта</h2>
            <ImageUploader type="recipe" id={1} recipeStepId={2} /> */}
        </div>
    );
}

export default Main;
