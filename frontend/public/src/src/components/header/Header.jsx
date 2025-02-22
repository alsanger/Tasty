import {useState} from 'react';
import SearchBar from '../common/SearchBar.jsx';
import LoginModal from './LoginModal.jsx';
import RegisterModal from './RegisterModal.jsx';
import MessageModal from '../common/MessageModal.jsx';
import logo from '../../assets/images/logo.svg';
import {faUser, faBell} from '@fortawesome/free-regular-svg-icons';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import '../../styles/header.scss';
import Button from "../common/Button.jsx";

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
                    <img src={logo} alt="Tasty"/>
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
                        icon={faPlus}
                        variant="icon-only"
                        onClick={() => console.log('Нажата кнопка плюс')}
                        isActive={true}
                    />

                    <Button
                        icon={faBell}
                        variant="header-icon"
                        onClick={() => console.log('Нажата кнопка уведомлений')}
                    />

                    <Button
                        icon={faUser}
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

            <MessageModal
                show={showMessageModal}
                onHide={() => setShowMessageModal(false)}
                message={message}
            />
        </header>
    );
};

export default Header;


/*
import {useState} from 'react';
import SearchBar from '../common/SearchBar.jsx';
import LoginModal from './LoginModal.jsx';
import logo from '../../assets/images/logo.svg';
import {faUser, faBell} from '@fortawesome/free-regular-svg-icons';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import '../../styles/header.scss';
import Button from "../common/Button.jsx";

const Header = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleLoginSuccess = (userData) => {
        // Handle successful login
        console.log('Logged in:', userData);
    };

    const handleSearch = (searchQuery) => {
        console.log('Search query:', searchQuery);
        // Здесь будет логика поиска
    };

    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="Tasty"/>
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>

                <div className="buttons-container">
                    <Button
                        text="Розумний холодильник"
                        onClick={() => console.log('Smart fridge clicked')}
                        isActive={true}
                        size="sm"
                    />

                    <Button
                        icon={faPlus}
                        variant="icon-only"
                        onClick={() => console.log('Plus clicked')}
                        isActive={true}
                    />

                    <Button
                        icon={faBell}
                        variant="header-icon"
                        onClick={() => console.log('Bell clicked')}
                    />

                    <Button
                        icon={faUser}
                        variant="header-icon"
                        onClick={() => setShowLoginModal(true)}
                    />
                </div>
            </div>

            <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </header>
    );
};

export default Header;
*/
