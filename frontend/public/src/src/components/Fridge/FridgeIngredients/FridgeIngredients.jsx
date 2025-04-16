// Файл components/Fridge/FridgeIngredients/FridgeIngredients.jsx
import React, {useState, useEffect, useRef} from 'react';
import {Container, Row, Col, Form, InputGroup} from 'react-bootstrap';
import Button from '../../_common/Button/Button';
import {RiDeleteBinLine} from 'react-icons/ri';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {updateFridge} from '../../../utils/fetchApi/fridgeApi';
import {getIngredients} from '../../../utils/fetchApi/ingredientApi';
import {useUser} from '../../../contexts/UserContext';
import './FridgeIngredients.scss';

const FridgeIngredients = ({
                               fridge,
                               fridgeIngredients: initialFridgeIngredients,
                               updateFridgeIngredients,
                               isLoading
                           }) => {
    console.log('[Холодильник] Рендер компонента FridgeIngredients');
    const {user} = useUser();
    const navigate = useNavigate();
    console.log('[Холодильник] Получены данные пользователя:', user);

    // Состояния компонента
    const [fridgeIngredients, setFridgeIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [tempIngredients, setTempIngredients] = useState([]);

    // Инициализация состояния ингредиентов из пропсов
    useEffect(() => {
        if (initialFridgeIngredients) {
            setFridgeIngredients(initialFridgeIngredients);
        }
    }, [initialFridgeIngredients]);

    // Загрузка списка всех доступных ингредиентов при монтировании компонента
    useEffect(() => {
        //console.log('[Холодильник] Сработал useEffect для загрузки списка ингредиентов');
        const fetchIngredientsData = async () => {
            try {
                //console.log('[Холодильник] Начало загрузки списка ингредиентов');
                const ingredientsData = await getIngredients();

                //console.log('[Холодильник] Данные ингредиентов успешно загружены:', { ingredientsData: ingredientsData.data });

                setAllIngredients(ingredientsData.data || []);
            } catch (error) {
                //console.error('[Холодильник] Ошибка при загрузке списка ингредиентов:', error);
                toast.error('Помилка при завантаженні списку інгредієнтів');
            }
        };

        fetchIngredientsData();
    }, []);

    // Фильтрация ингредиентов по поисковому запросу
    const filteredIngredients = fridgeIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //console.log('[Холодильник] Отфильтрованные ингредиенты:', { searchQuery, count: filteredIngredients.length });

    // Получаем список доступных для добавления ингредиентов (которых еще нет в холодильнике)
    const availableIngredients = allIngredients.filter(
        ing => !fridgeIngredients.some(fridgeIng => fridgeIng.id === ing.id)
    );
    //console.log('[Холодильник] Доступные для добавления ингредиенты:', { count: availableIngredients.length });

    // Обработчик изменения количества ингредиента
    const handleQuantityChange = (id, value) => {
        //console.log('[Холодильник] Изменение количества ингредиента:', { ingredientId: id, newValue: value });
        const newValue = value === '' ? '' : Math.max(0, parseFloat(value));

        const updatedIngredients = fridgeIngredients.map(ingredient => {
            if (ingredient.id === id) {
                return {...ingredient, quantity: newValue};
            }
            return ingredient;
        });

        setFridgeIngredients(updatedIngredients);
        updateFridgeIngredients(updatedIngredients); // Обновляем данные в родительском компоненте
        setIsModified(true);
        console.log('[Холодильник] Количество ингредиента обновлено, флаг изменений установлен');
    };

    // Обработчик изменения количества для временных ингредиентов
    const handleTempQuantityChange = (index, value) => {
        //console.log('[Холодильник] Изменение количества временного ингредиента:', { index, newValue: value });
        const newValue = value === '' ? '' : Math.max(0, parseFloat(value));

        const updatedTempIngredients = [...tempIngredients];
        updatedTempIngredients[index].quantity = newValue;
        setTempIngredients(updatedTempIngredients);
        setIsModified(true);
    };

    // Обработчик изменения выбранного ингредиента для временных строк
    const handleTempIngredientSelect = (index, value) => {
        //console.log('[Холодильник] Выбран ингредиент для временной строки:', { index, value });

        const selectedId = parseInt(value);
        // Находим полную информацию о выбранном ингредиенте
        const selectedIngredient = allIngredients.find(ing => ing.id === selectedId);

        if (!selectedIngredient) return;

        const updatedTempIngredients = [...tempIngredients];
        updatedTempIngredients[index] = {
            ...selectedIngredient,
            quantity: updatedTempIngredients[index].quantity
        };

        setTempIngredients(updatedTempIngredients);
        setIsModified(true);
    };

    // Обработчик удаления ингредиента
    const handleDeleteIngredient = (id) => {
        //console.log('[Холодильник] Удаление ингредиента:', { ingredientId: id });
        const updatedIngredients = fridgeIngredients.filter(ingredient => ingredient.id !== id);
        setFridgeIngredients(updatedIngredients);
        updateFridgeIngredients(updatedIngredients); // Обновляем данные в родительском компоненте
        setIsModified(true);
        //console.log('[Холодильник] Ингредиент удален, флаг изменений установлен');
    };

    // Обработчик удаления временного ингредиента
    const handleDeleteTempIngredient = (index) => {
        //console.log('[Холодильник] Удаление временного ингредиента:', { index });
        const updatedTempIngredients = tempIngredients.filter((_, i) => i !== index);
        setTempIngredients(updatedTempIngredients);
        setIsModified(true);
    };

    // Обработчик добавления нового ингредиента
    const handleAddIngredient = () => {
        //console.log('[Холодильник] Нажатие кнопки "Добавить ингредиент"');

        setTempIngredients([...tempIngredients, {id: '', quantity: 0}]);
        //console.log('[Холодильник] Добавлена новая строка для ингредиента');

        // Устанавливаем флаг, что нужна прокрутка к новому элементу
        setTimeout(() => {
            if (lastItemRef.current) {
                lastItemRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }, 100);
    };

    // Обработчик кнопки "Пошук рецептів"
    const handleSearchRecipes = () => {
        //console.log('[Холодильник] Нажатие кнопки "Поиск рецептов"');
        // Переходим на страницу поиска рецептов с установленным фильтром по холодильнику
        navigate('/recipes?fridge=true');
    };

    // Сохранение изменений
    const handleSaveChanges = async () => {
        //console.log('[Холодильник] Начало сохранения изменений', { fridge, userId: user?.id, ingredientsCount: fridgeIngredients.length });

        if (!fridge || !user?.id) {
            //console.log('[Холодильник] Нет данных холодильника или ID пользователя, сохранение невозможно');
            return;
        }

        try {
            //console.log('[Холодильник] Подготовка данных для сохранения');
            // Валидация временных ингредиентов
            const validTempIngredients = tempIngredients.filter(ing => ing.id && ing.id !== '');

            // Объединяем существующие и новые ингредиенты
            const allFridgeIngredients = [...fridgeIngredients];

            // Добавляем проверенные временные ингредиенты
            validTempIngredients.forEach(ing => {
                if (!allFridgeIngredients.some(existIng => existIng.id === ing.id)) {
                    allFridgeIngredients.push(ing);
                }
            });

            // Подготавливаем данные для отправки
            const ingredientsData = allFridgeIngredients.map(ing => ({
                ingredient_id: ing.id,
                quantity: parseFloat(ing.quantity) || 0
            }));

            const fridgeData = {
                user_id: user.id,
                ingredients: ingredientsData
            };

            //console.log('[Холодильник] Данные для отправки:', fridgeData);

            await updateFridge(fridge.id, fridgeData);
            //console.log('[Холодильник] Изменения успешно сохранены на сервере');
            toast.success('Зміни збережено успішно');

            // Обновляем состояние после сохранения
            setFridgeIngredients(allFridgeIngredients);
            updateFridgeIngredients(allFridgeIngredients); // Обновляем данные в родительском компоненте
            setTempIngredients([]);
            setIsModified(false);
        } catch (error) {
            //console.error('[Холодильник] Ошибка при сохранении изменений:', error);
            toast.error('Помилка при збереженні змін');
        }
    };

    const lastItemRef = useRef(null);

    return (
        <Container className="fridge-ingredients-container">
            <Row>
                <Col xs={12}>
                    <div className="fridge-buttons">
                        <Button
                            text="Додати"
                            onClick={handleAddIngredient}
                            isActive={true}
                        />
                        <Button
                            text="Пошук рецептів"
                            onClick={handleSearchRecipes}
                            isActive={true}
                        />
                    </div>
                    <h4 className="panel-title">&nbsp;Наявні інгредієнти:</h4>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <InputGroup className="custom-focus search-input">
                        <Form.Control
                            type="search"
                            placeholder="Пошук"
                            value={searchQuery}
                            onChange={(e) => {
                                console.log('[Холодильник] Изменение поискового запроса:', e.target.value);
                                setSearchQuery(e.target.value);
                            }}
                        />
                    </InputGroup>
                </Col>
            </Row>

            {isLoading ? (
                <Row>
                    <Col xs={12}>
                        <p>Завантаження інгредієнтів...</p>
                    </Col>
                </Row>
            ) : (
                <div className="ingredients-list">
                    {/* Существующие ингредиенты */}
                    {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ingredient) => (
                            <Row key={ingredient.id} className="ingredient-row">
                                <Col xs={8} className="ingredient-name">
                                    {ingredient.name} ({ingredient.unit?.short_name})
                                </Col>
                                <Col xs={3} className="quantity-input-col">
                                    <Form.Control
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                        className="quantity-input"
                                        min="0"
                                    />
                                </Col>
                                <Col xs={1} className="delete-button-col">
                                    <button
                                        className="delete-ingredient-btn"
                                        onClick={() => handleDeleteIngredient(ingredient.id)}
                                    >
                                        <RiDeleteBinLine/>
                                    </button>
                                </Col>
                            </Row>
                        ))
                    ) : searchQuery ? (
                        <Row>
                            <Col xs={12}>
                                <p className="no-ingredients">Інгредієнти не знайдено</p>
                            </Col>
                        </Row>
                    ) : null}

                    {/* Временные (новые) ингредиенты */}
                    {tempIngredients.map((tempIng, index) => (
                        <Row key={`temp-${index}`}
                             className="ingredient-row"
                             ref={index === tempIngredients.length - 1 ? lastItemRef : null}
                        >
                            <Col xs={8} className="ingredient-name">
                                <Form.Select
                                    value={tempIng.id || ''}
                                    onChange={(e) => handleTempIngredientSelect(index, e.target.value)}
                                    className="ingredient-select"
                                >
                                    <option value="">Оберіть інгредієнт</option>
                                    {allIngredients
                                        .filter(ing => !fridgeIngredients.some(fridgeIng => fridgeIng.id === ing.id) &&
                                            !tempIngredients.some((tempIng, i) => i !== index && tempIng.id === ing.id))
                                        .map(ingredient => (
                                            <option key={ingredient.id} value={ingredient.id}>
                                                {ingredient.name} ({ingredient.unit?.short_name})
                                            </option>
                                        ))
                                    }
                                </Form.Select>
                            </Col>
                            <Col xs={3} className="quantity-input-col">
                                <Form.Control
                                    type="number"
                                    value={tempIng.quantity}
                                    onChange={(e) => handleTempQuantityChange(index, e.target.value)}
                                    className="quantity-input"
                                    min="0"
                                />
                            </Col>
                            <Col xs={1} className="delete-button-col">
                                <button
                                    className="delete-ingredient-btn"
                                    onClick={() => handleDeleteTempIngredient(index)}
                                >
                                    <RiDeleteBinLine/>
                                </button>
                            </Col>
                        </Row>
                    ))}

                    {/* Сообщение если нет ингредиентов */}
                    {filteredIngredients.length === 0 && tempIngredients.length === 0 && !searchQuery && (
                        <Row>
                            <Col xs={12}>
                                <p className="no-ingredients">У холодильнику немає інгредієнтів</p>
                            </Col>
                        </Row>
                    )}
                </div>
            )}

            <Row className="mt-4">
                <Col xs={12}>
                    <Button
                        text="Зберегти зміни"
                        onClick={handleSaveChanges}
                        isActive={isModified}
                        disabled={!isModified}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default FridgeIngredients;