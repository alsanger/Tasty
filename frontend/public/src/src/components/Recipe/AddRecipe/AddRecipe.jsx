// Компонент src/components/Recipe/AddRecipe.jsx
import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button as BootstrapButton, Form} from 'react-bootstrap';
import Button from '../../_common/Button/Button';
import {toast} from 'react-toastify';
import {getCategories} from '../../../utils/fetchApi/categoryApi';
import {getCountries} from '../../../utils/fetchApi/countryApi';
import {getCookingMethods} from '../../../utils/fetchApi/cookingMethodApi';
import {getIngredients} from '../../../utils/fetchApi/ingredientApi';
import {createRecipe} from '../../../utils/fetchApi/recipeApi';
import {CiImageOn} from 'react-icons/ci';
import {RiDeleteBinLine} from 'react-icons/ri';
import RecipeStepsForm from '../RecipeStepsForm/RecipeStepsForm';
import {useUser} from '../../../contexts/UserContext';
import './AddRecipe.scss';

const AddRecipe = () => {
    const {user} = useUser();

    // Состояние формы рецепта
    const [recipeForm, setRecipeForm] = useState({
        name: '',
        description: '',
        time: '',
        country_id: '',
        category_id: '',
        cooking_method_id: '',
        ingredients: []
    });

    // Состояние для хранения списков
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cookingMethods, setCookingMethods] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [recipeImagePreview, setRecipeImagePreview] = useState(null);
    const [showIngredients, setShowIngredients] = useState(false);

    // Состояние для шагов рецепта
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, countriesData, cookingMethodsData, ingredientsData] = await Promise.all([
                    getCategories(),
                    getCountries(),
                    getCookingMethods(),
                    getIngredients()
                ]);

                setCategories(categoriesData.data || []);
                setCountries(countriesData.data || []);
                setCookingMethods(cookingMethodsData.data || []);
                setIngredientsList(ingredientsData.data || []);
            } catch (error) {
                toast.error('Помилка при завантаженні даних');
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData();
    }, []);

    // Обработчик изменения полей формы
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setRecipeForm({
            ...recipeForm,
            [name]: value
        });
    };

    // Обработчик изменения изображения рецепта
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecipeImage(file);
            setRecipeImagePreview(URL.createObjectURL(file));
        }
    };

    // Добавление ингредиента
    const handleAddIngredient = () => {
        if (!showIngredients) {
            setShowIngredients(true);
        }
        setRecipeForm({
            ...recipeForm,
            ingredients: [...recipeForm.ingredients, {ingredient_id: '', quantity: ''}]
        });
    };

    // Изменение ингредиента
    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...recipeForm.ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: value
        };
        setRecipeForm({
            ...recipeForm,
            ingredients: updatedIngredients
        });
    };

    // Удаление ингредиента
    const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...recipeForm.ingredients];
        updatedIngredients.splice(index, 1);
        setRecipeForm({
            ...recipeForm,
            ingredients: updatedIngredients
        });

        if (updatedIngredients.length === 0) {
            setShowIngredients(false);
        }
    };

    // Обработчик шагов рецепта
    const handleRecipeStepsChange = (steps) => {
        setRecipeSteps(steps);
    };

    // Подготовка данных для отправки на сервер - ИСПРАВЛЕННАЯ ФУНКЦИЯ
    const prepareFormData = () => {
        const formData = new FormData();

        // Основные данные рецепта
        formData.append('user_id', user?.id);
        formData.append('name', recipeForm.name);
        formData.append('description', recipeForm.description);
        formData.append('time', recipeForm.time);
        formData.append('country_id', recipeForm.country_id);
        formData.append('category_id', recipeForm.category_id);
        formData.append('cooking_method_id', recipeForm.cooking_method_id);

        // Изображение рецепта
        if (recipeImage) {
            formData.append('image', recipeImage);
        }

        // Ингредиенты как массив объектов (не JSON строка)
        recipeForm.ingredients.forEach((ingredient, index) => {
            formData.append(`ingredients[${index}][ingredient_id]`, ingredient.ingredient_id);
            formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
        });

        // Шаги рецепта как массив объектов (не JSON строка)
        recipeSteps.forEach((step, index) => {
            formData.append(`recipeSteps[${index}][description]`, step.description);
            formData.append(`recipeSteps[${index}][step_number]`, step.step_number);

            // Изображение шага
            if (step.image) {
                formData.append(`recipeSteps[${index}][image]`, step.image);
            }
        });

        return formData;
    };

    // Отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка наличия пользователя
        if (!user || !user.id) {
            toast.error('Необхідно увійти в систему, щоб додати рецепт');
            return;
        }

        // Проверка обязательных полей
        if (!recipeForm.name || !recipeForm.description || !recipeForm.time ||
            !recipeForm.country_id || !recipeForm.category_id || !recipeForm.cooking_method_id) {
            toast.warning('Будь ласка, заповність всі обов\'язкові поля');
            return;
        }

        // Проверка наличия хотя бы одного ингредиента
        if (recipeForm.ingredients.length === 0) {
            toast.warning('Додайте хоча б один інгредієнт');
            return;
        }

        // Проверка наличия хотя бы одного шага
        if (recipeSteps.length === 0) {
            toast.warning('Додайте хоча б один крок приготування');
            return;
        }

        try {
            setIsSubmitting(true);

            // Подготавливаем данные
            const formData = prepareFormData();

            // Для отладки - проверка содержимого FormData
            console.log('Отправляемые данные:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Отправляем данные
            const response = await createRecipe(formData);

            toast.success('Рецепт доданий!');

            // Сбрасываем форму после успешного создания
            setRecipeForm({
                name: '',
                description: '',
                time: '',
                country_id: '',
                category_id: '',
                cooking_method_id: '',
                ingredients: []
            });
            setRecipeSteps([]);
            setRecipeImage(null);
            setRecipeImagePreview(null);
            setShowIngredients(false);

        } catch (error) {
            toast.error('Ошибка при создании рецепта');
            console.error('Ошибка при создании рецепта:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="add-recipe-container">
            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* Левая часть - Шаги рецепта */}
                    <Col md={6}>
                        <RecipeStepsForm onChange={handleRecipeStepsChange} steps={recipeSteps}/>
                    </Col>
                    {/* Правая часть - Форма рецепта */}
                    <Col md={6}>
                        {/* Название рецепта */}
                        <Form.Group className="mb-3">
                            <Form.Label>Назва</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={recipeForm.name}
                                onChange={handleInputChange}
                                placeholder="Введіть назву рецепту"
                                required
                            />
                        </Form.Group>

                        {/* Описание рецепта */}
                        <Form.Group className="mb-3">
                            <Form.Label>Опис</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={recipeForm.description}
                                onChange={handleInputChange}
                                placeholder="Введіть опис рецепту"
                                required
                            />
                        </Form.Group>

                        {/* Изображение рецепта */}
                        <Form.Group className="mb-3">
                            <Form.Label>Зображення рецепту</Form.Label>
                            <div className="recipe-image-wrapper">
                                <input
                                    type="file"
                                    id="recipe-image"
                                    className="d-none"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="recipe-image" className="recipe-image-label">
                                    {recipeImagePreview ? (
                                        <img src={recipeImagePreview} alt="Зображення рецепту"
                                             className="recipe-image-preview"/>
                                    ) : (
                                        <div className="recipe-image-placeholder">
                                            <CiImageOn size={32}/>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </Form.Group>

                        {/* Категория */}
                        <Form.Group className="mb-3">
                            <Form.Label>Категорія</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={recipeForm.category_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Виберіть категорію</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Страна */}
                        <Form.Group className="mb-3">
                            <Form.Label>Країна</Form.Label>
                            <Form.Select
                                name="country_id"
                                value={recipeForm.country_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Виберіть країну</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Время приготовления */}
                        <Form.Group className="mb-3">
                            <Form.Label>Час</Form.Label>
                            <div className="time-input-wrapper">
                                <Form.Control
                                    type="number"
                                    name="time"
                                    value={recipeForm.time}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="Введіть час приготування"
                                    required
                                />
                                <span className="time-suffix">хв.</span>
                            </div>
                        </Form.Group>

                        {/* Способ приготовления */}
                        <Form.Group className="mb-3">
                            <Form.Label>Спосіб приготування</Form.Label>
                            <Form.Select
                                name="cooking_method_id"
                                value={recipeForm.cooking_method_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Виберіть спосіб</option>
                                {cookingMethods.map(method => (
                                    <option key={method.id} value={method.id}>{method.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Ингредиенты */}
                        <Form.Group className="mb-3">
                            <Form.Label>Інгредієнти</Form.Label>
                            {recipeForm.ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-row">
                                    <Form.Select
                                        value={ingredient.ingredient_id}
                                        onChange={(e) => handleIngredientChange(index, 'ingredient_id', e.target.value)}
                                        className="ingredient-select"
                                        required
                                    >
                                        <option value="">Виберіть інгредієнт</option>
                                        {ingredientsList.map(item => (
                                            <option key={item.id} value={item.id}>
                                                <span className="ingredient-name">{item.name}&nbsp;</span>
                                                <span className="ingredient-unit">({item.unit?.short_name})</span>
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control
                                        type="number"
                                        placeholder="Кількість"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        className="ingredient-quantity"
                                        required
                                    />
                                    <BootstrapButton
                                        variant="link"
                                        className="remove-ingredient-btn"
                                        onClick={() => handleRemoveIngredient(index)}
                                    >
                                        <RiDeleteBinLine/>
                                    </BootstrapButton>
                                </div>
                            ))}
                        </Form.Group>

                        <div className="button-group mb-3">
                            <Button
                                text="+ Додати інгредієнт"
                                className="add-ingredient-btn"
                                onClick={handleAddIngredient}
                                variant="default"
                            />

                            <BootstrapButton
                                variant="success"
                                className="submit-btn"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Публикация...' : 'Опублікувати'}
                            </BootstrapButton>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default AddRecipe;