// Файл Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaXTwitter, FaInstagram, FaViber } from 'react-icons/fa6';
import logo from '../../assets/images/logo.svg';
import { ROUTES } from '../../utils/routes.js';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="logo-container">
                    <Link to={ROUTES.HOME}>
                        <img src={logo} alt="Tasty" />
                    </Link>
                    <span className="copyright">© Tasty 2014-2025</span>
                </div>

                <div className="links-container">
                    <Link to="/about" className="footer-link" onClick={() => console.log('Нажато: Про нас')}>
                        Про нас
                    </Link>
                    <Link to="/contacts" className="footer-link" onClick={() => console.log('Нажато: Контакти')}>
                        Контакти
                    </Link>
                    <Link to="/privacy" className="footer-link" onClick={() => console.log('Нажато: Політика конфіденційності')}>
                        Політика конфіденційності
                    </Link>
                    <Link to="/terms" className="footer-link" onClick={() => console.log('Нажато: Правила використання')}>
                        Правила використання
                    </Link>
                    <Link to="/recipes" className="footer-link" onClick={() => console.log('Нажато: Каталог рецептів')}>
                        Каталог рецептів
                    </Link>
                    {/*<Link to="/new" className="footer-link" onClick={() => console.log('Нажато: Новинки')}>
                        Новинки
                    </Link>
                    <Link to="/popular" className="footer-link" onClick={() => console.log('Нажато: Популярні рецепти')}>
                        Популярні рецепти
                    </Link>*/}
                </div>

                <div className="social-container">
                    <a href="#" className="social-icon" onClick={(e) => {e.preventDefault(); console.log('Нажато: Facebook');}}>
                        <FaFacebook />
                    </a>
                    <a href="#" className="social-icon" onClick={(e) => {e.preventDefault(); console.log('Нажато: Twitter');}}>
                        <FaXTwitter />
                    </a>
                    <a href="#" className="social-icon" onClick={(e) => {e.preventDefault(); console.log('Нажато: Instagram');}}>
                        <FaInstagram />
                    </a>
                    <a href="#" className="social-icon" onClick={(e) => {e.preventDefault(); console.log('Нажато: Viber');}}>
                        <FaViber />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;