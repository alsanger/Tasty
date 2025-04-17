import React from 'react';
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
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
import ProfilePage from "./components/_profilePage/ProfilePage.jsx";
import AddRecipe from "./components/Recipe/AddRecipe/AddRecipe.jsx";
import Fridge from "./components/Fridge/Fridge.jsx";
import {ModalProvider} from "./contexts/ModalContext.jsx";
import {RecipesProvider} from "./contexts/RecipesContext.jsx";
import EditProfile from "./components/_profilePage/EditProfile/EditProfile.jsx";

// Компонент-обертка для условного отображения CountryButtonsNavigation
const AppContent = () => {
    const location = useLocation();

    // Список путей, где нужно показывать CountryButtonsNavigation
    const showNavigationPaths = ['/', '/recipes', '/recipe'];

    // Проверяем, должна ли навигация отображаться на текущем маршруте
    const shouldShowNavigation = showNavigationPaths.some(path =>
        location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    return (
        <div className="app-container" style={{fontFamily: FONT_FAMILIES.SECONDARY}}>
            <Header/>
            {shouldShowNavigation && <CountryButtonsNavigation/>}
            <div className="main-container">
                <Routes>
                    <Route exact path="/" element={<Main/>}/> {/* Главная страница */}
                    <Route path="/recipe/:id" element={<Recipe/>}/> {/* Страница рецепта */}
                    <Route path="/recipes" element={<RecipesPage/>}/> {/* Страница с рецептами */}
                    <Route path="/profile/:id" element={<ProfilePage/>}/> {/* Страница профиля пользователя */}
                    <Route path="/edit-profile" element={<EditProfile/>}/> {/* Страница редактирования профиля пользователя */}
                    <Route path="/add-recipe" element={<AddRecipe/>}/> {/* Страница добавления рецепта */}
                    <Route path="/fridge" element={<Fridge/>}/> {/* Страница "Холодильник" */}
                </Routes>
            </div>
            <Footer/>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <ModalProvider>
                    <RecipesProvider>
                        <AppContent/>
                    </RecipesProvider>
                </ModalProvider>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;