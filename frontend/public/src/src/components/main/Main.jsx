import React, {useEffect, useState} from 'react';
import CountryButtonsNavigation from "../CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import './Main.scss';
import CategoryCarousel from "../category/CategoryCarousel.jsx";
import {CameraIcon} from "lucide-react";
import ImageUploader from "../common/ImageUploader/index.js";
import { useUser } from '../../contexts/UserContext';
import UserCarousel from "../users/UserCarousel.jsx";
import {ENDPOINTS} from "../../utils/constants.js";


function Main() {
    const { user } = useUser();


    return (
        <div className="site-main">
            <CountryButtonsNavigation/>
            <CategoryCarousel/>
            <UserCarousel/>


            <ImageUploader
                endpoint={ENDPOINTS.IMAGE.UPLOAD_USER_AVATAR}
                id={user.id}
                currentImageUrl={user.avatar_url}
                onImageUpdate={(newUrl) => handleAvatarUpdate(newUrl)}
                button={{ text: 'Загрузить аватар' }}
            />



        </div>
    );
}

export default Main;
