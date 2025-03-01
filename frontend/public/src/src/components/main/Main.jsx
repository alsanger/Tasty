import React from 'react';
import CountryButtonsNavigation from "./CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import ImageUploader from "./ImageUploader.jsx";
import './Main.scss';
import CategoryCarousel from "../category/CategoryCarousel.jsx";
import {FaPlus} from "react-icons/fa6";
import {CameraIcon} from "lucide-react";


function Main() {
    return (
        <div className="site-main">
            <CountryButtonsNavigation/>
            <CategoryCarousel/>

            <ImageUploader
                type="avatar"
                id={1}
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
