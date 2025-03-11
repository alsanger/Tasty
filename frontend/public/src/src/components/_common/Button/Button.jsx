import { Button as BootstrapButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import "./Button.scss";

const Button = ({
                    icon: IconComponent,
                    text,
                    onClick,
                    isActive = false,
                    variant = 'default',  // 'default' | 'icon-only' | 'header-icon'
                    type = 'button',     // 'button' | 'submit' | 'reset'
                    colors = null,       // [defaultColor, hoverColor, activeColor]
                    activeColors = null, // [activeDefaultColor, activeHoverColor, activePressColor]
                }) => {
    const buttonClasses = [
        'custom-button',
        variant === 'header-icon' ? 'header-icon-button' : '',
        variant === 'icon-only' ? 'icon-only' : '',
        isActive ? 'active' : ''
    ].filter(Boolean).join(' ');

    // Создаем инлайн-стили для кастомных цветов
    const customStyle = {};

    if (colors && Array.isArray(colors) && colors.length >= 3) {
        customStyle['--button-default-color'] = colors[0];
        customStyle['--button-hover-color'] = colors[1];
        customStyle['--button-active-color'] = colors[2];
    }

    if (activeColors && Array.isArray(activeColors) && activeColors.length >= 3) {
        customStyle['--button-active-default-color'] = activeColors[0];
        customStyle['--button-active-hover-color'] = activeColors[1];
        customStyle['--button-active-press-color'] = activeColors[2];
    }

    return (
        <BootstrapButton
            className={buttonClasses}
            onClick={onClick}
            /*variant="outline"*/
            type={type}
            style={customStyle}
        >
            {IconComponent && (
                <IconComponent
                    className="button-icon"
                    size={variant === '_header-icon' ? 24 : 20}
                />
            )}
            {text && <span className="button-text">{text}</span>}
        </BootstrapButton>
    );
};

Button.propTypes = {
    icon: PropTypes.elementType,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.node
    ]),
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'icon-only', 'header-icon']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    colors: PropTypes.arrayOf(PropTypes.string),
    activeColors: PropTypes.arrayOf(PropTypes.string),
};

export default Button;

