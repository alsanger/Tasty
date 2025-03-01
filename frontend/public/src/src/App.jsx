import { BrowserRouter } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from "./contexts/UserContext.jsx";
import Main from "./components/main/Main.jsx";
import { FONT_FAMILIES } from './utils/constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <div className="app" style={{ fontFamily: FONT_FAMILIES.SECONDARY }}>
                    <Header />
                    <Main />
                </div>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;


/*import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/common/Header';
import FeaturedRecipes from './components/recipe/FeaturedRecipes';
import ScrollableList from './components/common/ScrollableList';
import RecipeCard from './components/recipe/RecipeCard';
import { recipeService } from './services/api';
import './styles/main.scss';
import './styles/Header.scss';

function App() {
    const [featuredRecipes, setFeaturedRecipes] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newRecipes, setNewRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [bestRecipes, setBestRecipes] = useState([]);
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    featuredRes,
                    categoriesRes,
                    newRes,
                    popularRes,
                    bestRes,
                    authorsRes
                ] = await Promise.all([
                    recipeService.getFeaturedRecipes(),
                    recipeService.getCategories(),
                    recipeService.getNewRecipes(),
                    recipeService.getPopularRecipes(),
                    recipeService.getBestRecipes(),
                    recipeService.getAuthors()
                ]);

                setFeaturedRecipes(featuredRes.data);
                setCategories(categoriesRes.data);
                setNewRecipes(newRes.data);
                setPopularRecipes(popularRes.data);
                setBestRecipes(bestRes.data);
                setAuthors(authorsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="app">
            <Header />

            {featuredRecipes && (
                <FeaturedRecipes recipes={featuredRecipes} />
            )}

            <Container>
                <ScrollableList title="Категорії">
                    {categories.map(category => (
                        <div key={category.id} className="category-item">
                            <img src={category.icon_url} alt={category.name} />
                            <span>{category.name}</span>
                        </div>
                    ))}
                </ScrollableList>

                <ScrollableList title="Новинки">
                    {newRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </ScrollableList>

                <ScrollableList title="Популярні">
                    {popularRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </ScrollableList>

                <ScrollableList title="Найкращі">
                    {bestRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </ScrollableList>

                <ScrollableList title="Популярні автори">
                    {authors.map(author => (
                        <div key={author.id} className="author-item">
                            <img src={author.avatar_url} alt={author.display_name} />
                            <span>{author.display_name}</span>
                        </div>
                    ))}
                </ScrollableList>
            </Container>
        </div>
    );
}

export default App;*/
