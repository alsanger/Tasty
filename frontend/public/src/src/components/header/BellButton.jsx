import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';
import { faBell as faBellSolid } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

const BellButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false); // состояние для отслеживания наведения

    return (
        <Button
            variant="link"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)} // устанавливаем состояние на true при наведении
            onMouseLeave={() => setIsHovered(false)} // восстанавливаем на false при уходе с иконки
        >
            <FontAwesomeIcon
                icon={isHovered ? faBellSolid : faBellRegular} // условное изменение иконки
                size="lg"
            />
        </Button>
    );
};

BellButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default BellButton;
