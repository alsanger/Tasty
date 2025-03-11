import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button.jsx';

const Buttons = ({ buttons, className = '' }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {buttons.map((buttonProps, index) => (
                <Button
                    key={buttonProps.id || index}
                    icon={buttonProps.icon}
                    text={buttonProps.text}
                    onClick={buttonProps.onClick}
                    isActive={buttonProps.isActive}
                    variant={buttonProps.variant}
                    type={buttonProps.type}
                />
            ))}
        </div>
    );
};

Buttons.propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            icon: PropTypes.elementType,
            text: PropTypes.string,
            onClick: PropTypes.func.isRequired,
            isActive: PropTypes.bool,
            variant: PropTypes.oneOf(['default', 'icon-only', 'header-icon']),
            type: PropTypes.oneOf(['button', 'submit', 'reset'])
        })
    ).isRequired,
    className: PropTypes.string
};

export default Buttons;
