/*
import {useState} from 'react';
import SearchBar from '../_common/SearchBar/SearchBar.jsx';
import LoginModal from './LoginModal/LoginModal.jsx';
import RegisterModal from './RegisterModal/RegisterModal.jsx';
import logo from '../../assets/images/logo.svg';
import { FaPlus } from "react-icons/fa6";
import { FiUser, FiBell } from "react-icons/fi";
import './Header.scss';
import Button from "../_common/Button/Button.jsx";
import {ROUTES} from "../../utils/routes.js";
import {Link} from "react-router-dom";

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleSearch = (searchQuery) => {
        console.log('Поисковый запрос:', searchQuery);
    };

    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo-container">
                    <Link to={ROUTES.HOME}>
                        <img src={logo} alt="Tasty" />
                    </Link>
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>

                <div className="buttons-container">
                    <Button
                        text="Розумний холодильник"
                        onClick={() => console.log('Нажата кнопка умного холодильника')}
                        isActive={true}
                        size="sm"
                    />

                    <Button
                        icon={FaPlus}
                        variant="icon-only"
                        onClick={() => console.log('Нажата кнопка плюс')}
                        isActive={true}
                    />

                    <Button
                        icon={FiBell}
                        variant="header-icon"
                        onClick={() => console.log('Нажата кнопка уведомлений')}
                    />

                    <Button
                        icon={FiUser}
                        variant="header-icon"
                        onClick={() => setShowLoginModal(true)}
                    />
                </div>
            </div>

            <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                onShowRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
            />

            <RegisterModal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                onShowLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                }}
            />
        </header>
    );
};

export default Header;
*/

import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SearchBar from '../_common/SearchBar/SearchBar.jsx';
import LoginModal from './LoginModal/LoginModal.jsx';
import RegisterModal from './RegisterModal/RegisterModal.jsx';
import logo from '../../assets/images/logo.svg';
import { FaPlus } from "react-icons/fa6";
import { FiUser, FiBell } from "react-icons/fi";
import './Header.scss';
import Button from "../_common/Button/Button.jsx";
import {ROUTES} from "../../utils/routes.js";
import {Link} from "react-router-dom";

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

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
                        <img src={logo} alt="Tasty" />
                    </Link>
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>

                <div className="buttons-container">
                    <Button
                        text="Розумний холодильник"
                        onClick={() => console.log('Нажата кнопка умного холодильника')}
                        isActive={true}
                        size="sm"
                    />

                    <Button
                        icon={FaPlus}
                        variant="icon-only"
                        onClick={() => console.log('Нажата кнопка плюс')}
                        isActive={true}
                    />

                    <Button
                        icon={FiBell}
                        variant="header-icon"
                        onClick={() => console.log('Нажата кнопка уведомлений')}
                    />

                    <Button
                        icon={FiUser}
                        variant="header-icon"
                        onClick={() => setShowLoginModal(true)}
                    />
                </div>
            </div>

            <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                onShowRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
            />

            <RegisterModal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                onShowLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                }}
            />
        </header>
    );
};

export default Header;