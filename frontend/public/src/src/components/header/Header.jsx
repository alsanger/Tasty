import {useState} from 'react';
import SearchBar from '../common/SearchBar/SearchBar.jsx';
import LoginModal from './LoginModal/LoginModal.jsx';
import RegisterModal from './RegisterModal/RegisterModal.jsx';
import MessageModal from '../common/MessageModal/MessageModal.jsx';
import logo from '../../assets/images/logo.svg';
import { FaPlus } from "react-icons/fa6";
import { FiUser, FiBell } from "react-icons/fi";
import './Header.scss';
import Button from "../common/Button/Button.jsx";
import {ROUTES} from "../../utils/routes.js";
import {Link} from "react-router-dom";

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState(null);

    const handleLoginSuccess = (userData) => {
        console.log('Успешный вход:', userData);
    };

    const handleSearch = (searchQuery) => {
        console.log('Поисковый запрос:', searchQuery);
    };

    const handleShowMessage = (messageData) => {
        console.log('Показ сообщения:', messageData);
        setMessage(messageData);
        setShowMessageModal(true);
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
                onLoginSuccess={handleLoginSuccess}
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
                onShowMessage={handleShowMessage}
            />
        </header>
    );
};

export default Header;
