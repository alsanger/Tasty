import { Button as BootstrapButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import "../../styles/Button.scss";

const Button = ({
                    icon,
                    text,
                    onClick,
                    isActive = false,
                    variant = 'default',  // 'default' | 'icon-only' | 'header-icon'
                    size = 'md', // 'sm' | 'md' | 'lg'
                }) => {
    const buttonClasses = [
        'custom-button', // Базовый класс всегда будет
        variant === 'header-icon' ? 'header-icon-button' : '',
        variant === 'icon-only' ? 'icon-only' : '',
        isActive ? 'active' : '',
        `size-${size}`
    ].filter(Boolean).join(' ');

    return (
        <BootstrapButton
            className={buttonClasses}
            onClick={onClick}
            variant="link" // Убираем условие, всегда используем 'link'
        >
            {icon && (
                <FontAwesomeIcon
                    icon={icon}
                    className="button-icon"
                    size={variant === 'header-icon' ? 'lg' : undefined} // Увеличиваем размер иконок в хедере
                />
            )}
            {text && <span className="button-text">{text}</span>}
        </BootstrapButton>
    );
};

Button.propTypes = {
    icon: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'icon-only', 'header-icon']),
    size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default Button;
