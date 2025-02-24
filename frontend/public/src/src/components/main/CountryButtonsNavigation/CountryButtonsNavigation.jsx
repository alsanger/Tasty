import React, { useState } from 'react';
import Buttons from '../../common/Buttons/Buttons';
import { GiChefToque } from 'react-icons/gi';

const CountryButtonsNavigation = () => {
    const [activeCountry, setActiveCountry] = useState('all');

    const navigationButtons = [
        {
            id: 'all',
            text: 'Всі рецепти',
            icon: GiChefToque,
            variant: 'default',
            onClick: () => setActiveCountry('all'),
            isActive: activeCountry === 'all'
        },
        {
            id: 'ukraine',
            text: 'Україна',
            variant: 'default',
            onClick: () => setActiveCountry('ukraine'),
            isActive: activeCountry === 'ukraine'
        },
        {
            id: 'italy',
            /*text: 'Італія',*/
            text: 'Съешь французскую булку БББббб',
            variant: 'default',
            onClick: () => setActiveCountry('italy'),
            isActive: activeCountry === 'italy'
        },
        {
            id: 'france',
            text: 'Франція',
            variant: 'default',
            onClick: () => setActiveCountry('france'),
            isActive: activeCountry === 'france'
        },
        {
            id: 'mexico',
            text: 'Мексика',
            variant: 'default',
            onClick: () => setActiveCountry('mexico'),
            isActive: activeCountry === 'mexico'
        },
        {
            id: 'asia',
            text: 'Азія',
            variant: 'default',
            onClick: () => setActiveCountry('asia'),
            isActive: activeCountry === 'asia'
        },
        {
            id: 'america',
            text: 'Америка',
            variant: 'default',
            onClick: () => setActiveCountry('america'),
            isActive: activeCountry === 'america'
        },
        {
            id: 'germany',
            text: 'Німеччина',
            variant: 'default',
            onClick: () => setActiveCountry('germany'),
            isActive: activeCountry === 'germany'
        },
        {
            id: 'georgia',
            text: 'Грузія',
            variant: 'default',
            onClick: () => setActiveCountry('georgia'),
            isActive: activeCountry === 'georgia'
        },
        {
            id: 'turkey',
            text: 'Туреччина',
            variant: 'default',
            onClick: () => setActiveCountry('turkey'),
            isActive: activeCountry === 'turkey'
        }
    ];

    return (
        <Buttons
            buttons={navigationButtons}
            className="p-4"
        />
    );
};

export default CountryButtonsNavigation;