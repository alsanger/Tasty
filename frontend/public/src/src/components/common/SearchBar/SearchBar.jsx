import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import PropTypes from "prop-types";
import "./SearchBar.scss";

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(searchQuery);
    };

    return (
        <Form onSubmit={handleSubmit} className="search-bar">
            <InputGroup className="custom-focus">
                <Form.Control
                    type="search"
                    placeholder="Пошук рецептів"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-success" type="submit">
                    <FaSearch />
                </Button>
            </InputGroup>
        </Form>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
