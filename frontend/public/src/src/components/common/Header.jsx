import { useState } from 'react';
import SearchBar from '../auth/SearchBar.jsx';
import LoginModal from '../auth/LoginModal';
import logo from '../../assets/images/logo.svg';
import AuthButton from '../auth/AuthButton.jsx';
import '../../styles/header.scss';

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleSearch = (searchQuery) => {
        console.log('Search query:', searchQuery);
        // Здесь будет логика поиска
    };

    return (
        <header className="site-header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="Tasty" />
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className="auth-buttons">
                    <AuthButton onClick={() => setShowLogin(true)} />
                </div>
            </div>

            <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
        </header>
    );
};

export default Header;
