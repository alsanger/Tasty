import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Category from './Category.jsx';
import { getCategoryById } from '../../utils/fetchApi/categoryApi';

const CategoryExample = () => {
    const [category, setCategory] = useState(null);

    useEffect(() => {
        // Пример получения данных категории
        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(2); // ID категории "Основні страви"
                setCategory(response.data);
            } catch (error) {
                console.error('Error fetching Сategory:', error);
            }
        };

        fetchCategory();
    }, []);

    const handleCategoryClick = (categoryId) => {
        console.log(`Navigate to recipes filtered by category ID: ${categoryId}`);
        // TODO: В будущем здесь будет навигация на страницу с фильтрацией по категории
    };

    return (
        <Container>
            <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                    {category && (
                        <Category category={category} onClick={handleCategoryClick} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CategoryExample;