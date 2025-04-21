import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SearchBar from '../_common/SearchBar/SearchBar.jsx';
import logo from '../../assets/images/logo.svg';
import {FaPlus} from "react-icons/fa6";
import {FiUser, FiBell} from "react-icons/fi";
import './Header.scss';
import Button from "../_common/Button/Button.jsx";
import {ROUTES} from "../../utils/routes.js";
import {Link} from "react-router-dom";
import {useUser} from "../../contexts/UserContext.jsx";
import {BASE_URL} from "../../utils/constants.js";
import {useModal} from "../../contexts/ModalContext.jsx";

const Header = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useUser();
    const { showModal } = useModal();

    const profileClick = () => {
        navigate(`/profile/${user?.id}`, {
            state: { user },
        });
    };

    const handleSearch = (searchQuery) => {
        console.log('Поисковый запрос:', searchQuery);
        if (searchQuery && searchQuery.trim()) {
            // Перенаправляем на страницу рецептов с параметром поиска
            navigate(`/recipes?name=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo-container">
                    <Link to={ROUTES.HOME}>
                        <img src={logo} alt="Tasty"/>
                    </Link>
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>

                <div className="buttons-container">
                    {isAuthenticated && user && (
                        <>
                            <Button
                                text="Розумний холодильник"
                                onClick={() => {
                                    console.log('Нажата кнопка умного холодильника');
                                    navigate('/fridge');
                                }}
                                isActive={true}
                                size="sm"
                            />

                            <Button
                                icon={FaPlus}
                                variant="icon-only"
                                onClick={() => {
                                    console.log('Нажата кнопка плюс');
                                    navigate('/add-recipe');
                                }}
                                isActive={true}
                            />

                            <Button
                                icon={FiBell}
                                variant="header-icon"
                                onClick={() => console.log('Нажата кнопка уведомлений')}
                            />

                            <Button
                                onClick={profileClick}
                                variant="icon-only"
                                avatarSrc={`${BASE_URL}${user?.avatarUrl}`}
                            />
                        </>
                    )}

                    {!(isAuthenticated && user) && (
                        <Button
                            icon={FiUser}
                            variant="header-icon"
                            onClick={() => showModal('login')}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;