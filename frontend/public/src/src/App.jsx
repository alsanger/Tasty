/*
import { BrowserRouter } from 'react-router-dom';
import Header from './components/_header/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from "./contexts/UserContext.jsx";
import Main from "./components/_main/Main.jsx";
import { FONT_FAMILIES } from './utils/constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from "./components/_footer/Footer.jsx";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <div className="app-container" style={{ fontFamily: FONT_FAMILIES.SECONDARY }}>
                    <Header />
                    <Main className="main-content" />
                    <Footer />
                </div>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
*/
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';  // Импортируем необходимые компоненты
import Header from './components/_header/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from "./contexts/UserContext.jsx";
import {FONT_FAMILIES} from './utils/constants.js';
import './App.css';
import Footer from "./components/_footer/Footer.jsx";

// Импортируем страницы
import Recipe from './components/_recipe/Recipe';
import Main from "./components/_main/Main";
import CountryButtonsNavigation from "./components/CountryButtonsNavigation/CountryButtonsNavigation.jsx";
import RecipesPage from "./components/_recipesPage/RecipesPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <div className="app-container" style={{fontFamily: FONT_FAMILIES.SECONDARY}}>
                    <Header/>
                    <CountryButtonsNavigation/>
                    <div className="main-container">
                        <Routes>
                            <Route exact path="/" element={<Main/>}/> {/* Главная страница */}
                            <Route path="/recipe/:id" element={<Recipe/>}/> {/* Страница рецепта, с параметром id */}
                            <Route path="/recipes-page" element={<RecipesPage/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
