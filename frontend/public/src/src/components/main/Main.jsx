import React, {useEffect, useState} from 'react';
import CountryButtonsNavigation from "../CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import './Main.scss';
import CategoryCarousel from "../category/CategoryCarousel.jsx";
import {FaPlus} from "react-icons/fa6";
import {CameraIcon} from "lucide-react";
import ImageUploader from "../common/ImageUploader/index.js";
import {Link} from "react-router-dom";
import {ROUTES} from "../../utils/routes.js";
import { useUser } from '../../contexts/UserContext';
import UserExample from "../users/UserExample.jsx";
import {getImage} from "../../utils/fetchApi/image.js";


function Main() {
    const { user } = useUser();

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            const url = await getImage('http://localhost:8000/storage/avatars/1.jpeg');
            setImageUrl(url);
        };
        loadImage();
    }, []);

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

            {/*<UserExample />*/}
            {imageUrl && (
                <Card>
                    <Card.Img variant="top" src={imageUrl} />
                </Card>
            )}

        </div>
    );
}

export default Main;
