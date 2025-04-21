// Файл components/Fridge/Fridge.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FridgeIngredients from './FridgeIngredients/FridgeIngredients';
import CookingPlanList from '../CookingPlanList/CookingPlanList';
import { getFridgeByUser } from '../../utils/fetchApi/fridgeApi';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import './Fridge.scss';

const Fridge = () => {
    const { user } = useUser();
    const [fridge, setFridge] = useState(null);
    const [fridgeIngredients, setFridgeIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка данных холодильника при монтировании компонента
    useEffect(() => {
        console.log('[Холодильник Fridge] Сработал useEffect для загрузки данных');
        const fetchFridgeData = async () => {
            if (!user?.id) {
                console.log('[Холодильник Fridge] Нет ID пользователя, пропускаем загрузку');
                setIsLoading(false);
                return;
            }

            try {
                console.log('[Холодильник Fridge] Начало загрузки данных холодильника');
                setIsLoading(true);

                // Получаем данные холодильника
                const fridgeData = await getFridgeByUser(user.id);

                console.log('[Холодильник Fridge] Данные успешно загружены:', {
                    fridgeData: fridgeData.data
                });

                setFridge(fridgeData.data);
                setFridgeIngredients(fridgeData.data.ingredients || []);
            } catch (error) {
                console.error('[Холодильник Fridge] Ошибка при загрузке данных:', error);
                toast.error('Помилка при завантаженні даних');
            } finally {
                console.log('[Холодильник Fridge] Завершение загрузки данных');
                setIsLoading(false);
            }
        };

        fetchFridgeData();
    }, [user]);

    // Функция для обновления данных ингредиентов из дочернего компонента
    const updateFridgeIngredients = (updatedIngredients) => {
        setFridgeIngredients(updatedIngredients);
    };

    return (
        <Container fluid className="fridge-page">
            <Row>
                <Col xs={12}>
                    <h3 className="fridge-title">Розумний холодильник</h3>
                </Col>
            </Row>

            <Row className="fridge-content">
                {/* Левая часть: FridgeIngredients */}
                <Col md={6} className="fridge-left-panel">
                    <div className="panel-container">
                        <FridgeIngredients
                            fridge={fridge}
                            fridgeIngredients={fridgeIngredients}
                            updateFridgeIngredients={updateFridgeIngredients}
                            isLoading={isLoading}
                        />
                    </div>
                </Col>

                {/* Правая часть: CookingPlanList */}
                <Col md={6} className="fridge-right-panel">
                    <div className="panel-container panel-container-right">
                        <CookingPlanList fridgeIngredients={fridgeIngredients} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Fridge;
