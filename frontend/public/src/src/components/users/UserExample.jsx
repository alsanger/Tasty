import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import User from './User.jsx';
import { getUserById } from '../../utils/fetchApi/userApi';

const UserExample = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Пример получения данных пользователя
        const fetchUser = async () => {
            try {
                const response = await getUserById(1); // Пример ID пользователя
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const handleUserClick = (userId) => {
        console.log(`Navigate to user profile with ID: ${userId}`);
        // TODO: В будущем здесь будет навигация на страницу профиля пользователя
    };

    return (
        <Container>
            <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                    {user && (
                        <User user={user} onClick={handleUserClick} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserExample;
