import React, {useEffect, useState} from 'react';
import CountryButtonsNavigation from "../CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import './Main.scss';
import CategoryCarousel from "../category/CategoryCarousel.jsx";
import {CameraIcon} from "lucide-react";
import ImageUploader from "../common/ImageUploader/index.js";
import { useUser } from '../../contexts/UserContext';
import UserCarousel from "../users/UserCarousel.jsx";


function Main() {
    const { user } = useUser();


    return (
        <div className="site-main">
            <CountryButtonsNavigation/>
            <CategoryCarousel/>
            <UserCarousel/>

            <ImageUploader
                type="avatar"
                id={26}
                button={{
                    text: "Вибрати фото",
                    icon: CameraIcon,
                    variant: "success",
                }}
                onImageUpdate={(url) => console.log('Новое изображение:', url)}
            />



        </div>
    );
}

export default Main;
