import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import "../../styles/IconButton.scss";

const IconButton = ({ icon, onClick, size = "lg" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            variant="link"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="icon-button"
        >
            <FontAwesomeIcon
                icon={icon}
                size={size}
                style={{
                    transition: 'transform 0.2s ease',
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                }}
            />
        </Button>
    );
};

IconButton.propTypes = {
    icon: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.string
};

export default IconButton;
