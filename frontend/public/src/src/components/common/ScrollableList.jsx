import  { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line react/prop-types
const ScrollableList = ({ children, title }) => {
    const containerRef = useRef(null);

    const scroll = (direction) => {
        const container = containerRef.current;
        const scrollAmount = container.offsetWidth;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="mb-4">
            <h2 className="mb-3">{title}</h2>
            <div className="scrollable-list">
                <Button
                    className="scroll-button prev"
                    onClick={() => scroll('left')}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <div className="items-container" ref={containerRef}>
                    {children}
                </div>
                <Button
                    className="scroll-button next"
                    onClick={() => scroll('right')}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </div>
        </div>
    );
};

export default ScrollableList;