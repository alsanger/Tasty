import React from 'react';
import './Main.scss';
import CategoryCarousel from "../Сategory/CategoryCarousel.jsx";
import ImageUploader from "../_common/ImageUploader/index.js";
import { useUser } from '../../contexts/UserContext';
import UserCarousel from "./UserCarousel.jsx";
import {ENDPOINTS} from "../../utils/constants.js";
import RecipeGridTheBest from "./RecipeGridTheBest.jsx";
import RecipeGridDayWeekMonth from "./RecipeGridDayWeekMonth.jsx";
import RecipesByDifficulty from "./RecipesByDifficulty.jsx";
import {getNewRecipes, getPopularRecipes} from '../../utils/fetchApi/recipeApi';
import RecipesCarousel from "./RecipesCarousel.jsx";


const Main = () => {
    const { user } = useUser();

    return (
        <div>
            <RecipeGridDayWeekMonth/>
            <CategoryCarousel/>
            <RecipesCarousel getRecipesMethod={getNewRecipes} title={"Новинки"}/>
            <RecipesCarousel getRecipesMethod={getPopularRecipes} title={"Популярні"}/>
            <RecipeGridTheBest/>
            <UserCarousel/>
            <RecipesByDifficulty/>


            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_USER_AVATAR}
                id={user?.id}
                button={{ text: 'Загрузить аватар' }}
            />
            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_RECIPE_IMAGE}
                id={22}
                button={{ text: 'Загрузить изображение рецепта' }}
            />
            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_RECIPE_STEP_IMAGE}
                id={31}
                recipeId={19}
                button={{ text: 'Загрузить изображение шага рецепта' }}
            />
        </div>
    );
}

export default Main;
