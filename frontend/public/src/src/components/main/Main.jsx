// src/components/main/Main.jsx
import React from 'react';
import CountryButtonsNavigation from "./CountryButtonsNavigation/CountryButtonsNavigation.jsx";

function Main() {
    return (
        <div className="main">
            <CountryButtonsNavigation />
            <p>Это основное содержимое твоего приложения.</p>
        </div>
    );
}

export default Main;
