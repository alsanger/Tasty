import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { faUser as faUserSolid } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

const AuthButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false); // состояние для отслеживания наведения

    return (
        <Button
            variant="link"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)} // устанавливаем состояние на true при наведении
            onMouseLeave={() => setIsHovered(false)} // восстанавливаем на false при уходе с иконки
        >
            <FontAwesomeIcon
                icon={isHovered ? faUserSolid : faUserRegular} // условное изменение иконки
                size="lg"
            />
        </Button>
    );
};

AuthButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AuthButton;
