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
                }) => {
    const buttonClasses = [
        'custom-button',
        variant === 'header-icon' ? 'header-icon-button' : '',
        variant === 'icon-only' ? 'icon-only' : '',
        isActive ? 'active' : ''
    ].filter(Boolean).join(' ');

    return (
        <BootstrapButton
            className={buttonClasses}
            onClick={onClick}
            variant="outline"
            type={type}
        >
            {IconComponent && (
                <IconComponent
                    className="button-icon"
                    size={variant === 'header-icon' ? 24 : 20}
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
};

export default Button;
