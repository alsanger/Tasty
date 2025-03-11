import React, {useEffect, useState} from 'react';
import CountryButtonsNavigation from "../CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import './Main.scss';
import CategoryCarousel from "../Сategory/CategoryCarousel.jsx";
import ImageUploader from "../_common/ImageUploader/index.js";
import { useUser } from '../../contexts/UserContext';
import UserCarousel from "./UserCarousel.jsx";
import {ENDPOINTS} from "../../utils/constants.js";
import RecipeGridTheBest from "./RecipeGridTheBest.jsx";
import RecipeGridDayWeekMonth from "./RecipeGridDayWeekMonth.jsx";
import RecipesByDifficulty from "./RecipesByDifficulty.jsx";
import Recipes2Carousel from "./Recipes2Carousel.jsx";
import {getNewRecipes, getPopularRecipes} from '../../utils/fetchApi/recipeApi';


function Main() {
    const { user } = useUser();


    return (
        <div className="site-main main-content">
            <CountryButtonsNavigation/>
            <RecipeGridDayWeekMonth/>
            <CategoryCarousel/>
            <Recipes2Carousel getRecipesMethod={getNewRecipes} title={"Новинки"}/>
            <Recipes2Carousel getRecipesMethod={getPopularRecipes} title={"Популярні"}/>
            <RecipeGridTheBest/>
            <UserCarousel/>
            <RecipesByDifficulty/>



            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_USER_AVATAR}
                id={user.id}
                currentImageUrl={user.avatar_url}
                onImageUpdate={(newUrl) => handleAvatarUpdate(newUrl)}
                button={{ text: 'Загрузить аватар' }}
            />
            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_RECIPE_IMAGE}
                id={21}
                currentImageUrl={user.avatar_url}
                onImageUpdate={(newUrl) => handleAvatarUpdate(newUrl)}
                button={{ text: 'Загрузить изображение рецепта' }}
            />



        </div>
    );
}

export default Main;
