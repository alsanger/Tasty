import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import "../../styles/CustomButton.scss";

const CustomButton = ({
                          icon,
                          text,
                          onClick,
                          isActive = false,
                          variant = 'default',  // 'default' | 'icon-only'
                          size = 'md' // 'sm' | 'md' | 'lg'
                      }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonClasses = [
        'custom-button',
        variant === 'icon-only' ? 'icon-only' : '',
        isActive ? 'active' : '',
        `size-${size}`
    ].filter(Boolean).join(' ');

    return (
        <Button
            className={buttonClasses}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {icon && (
                <FontAwesomeIcon
                    icon={icon}
                    className="button-icon"
                    style={{
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                />
            )}
            {text && <span className="button-text">{text}</span>}
        </Button>
    );
};

CustomButton.propTypes = {
    icon: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'icon-only']),
    size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default CustomButton;