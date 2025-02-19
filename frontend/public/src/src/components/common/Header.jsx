import {useState} from 'react';
import SearchBar from '../header/SearchBar.jsx';
import LoginModal from '../header/LoginModal';
import logo from '../../assets/images/logo.svg';
import {faUser, faBell} from '@fortawesome/free-regular-svg-icons';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import '../../styles/header.scss';
import IconButton from "./IconButton.jsx";
import CustomButton from "./CustomButton.jsx";

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
                    <img src={logo} alt="Tasty"/>
                </div>

                <div className="search-container">
                    <SearchBar onSearch={handleSearch}/>
                </div>

                <div className={"personal-buttons-container"}>
                    <CustomButton
                        icon={faPlus}
                        variant="icon-only"
                        onClick={() => console.log('Plus clicked')}
                        isActive={true}
                        size="lg"
                    />

                    <CustomButton
                        text="Розумний холодильник"
                        onClick={() => console.log('Smart fridge clicked')}
                        isActive={true}
                        size="lg"
                    />
                </div>

                <div className="auth-buttons-container">
                    <IconButton
                        icon={faBell}
                        onClick={() => console.log('Bell clicked')}
                    />

                    <IconButton
                        icon={faUser}
                        onClick={() => setShowLogin(true)}
                    />
                </div>
            </div>

            <LoginModal show={showLogin} onHide={() => setShowLogin(false)}/>
        </header>
    );
};

export default Header;
