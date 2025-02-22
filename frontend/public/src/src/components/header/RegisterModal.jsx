import {useState} from 'react';
import {Modal, Form, Spinner} from 'react-bootstrap';
import {userApi} from '../../utils/fetchApi';
import Input from '../common/Input';
import Button from '../common/Button';
import '../../styles/RegisterModal.scss';
import logo from '../../assets/images/logo.svg';
import {useUser} from "../../contexts/UserContext.jsx";

const RegisterModal = ({show, onHide, onShowLogin, onShowMessage}) => {
    const {login} = useUser();

    // Начальное состояние формы
    const [formData, setFormData] = useState({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({});

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(`Поле ${name} изменено на: ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибку поля при его изменении
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Локальная валидация формы
    const validateForm = () => {
        const newErrors = {};

        if (!formData.display_name.trim()) {
            newErrors.display_name = "Ім'я користувача є обов'язковим";
        } else if (formData.display_name.length > 255) {
            newErrors.display_name = "Ім'я користувача є занадто довгим";
        }

        if (!formData.email) {
            newErrors.email = "Email є обов'язковим";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Невірний формат email";
        }

        if (!formData.password) {
            newErrors.password = "Пароль є обов'язковим";
        } else if (formData.password.length < 8) {
            newErrors.password = "Пароль повинен містити мінімум 8 символів";
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Паролі не співпадають";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Попытка отправки формы регистрации');

        if (!validateForm()) {
            console.log('Форма не прошла валидацию');
            return;
        }

        setLoading(true);
        try {
            console.log('Отправка данных на сервер:', formData);
            const response = await userApi.register(formData);
            console.log('Ответ сервера:', response);

            // Автоматический вход после регистрации
            await login(response);

            onShowMessage({
                type: 'success',
                text: 'Реєстрація успішна!'
            });

            onHide();
            // ЗДЕСЬ ДОЛЖНО БЫТЬ ПЕРЕНАПРАВЛЕНИЕ НА ЛИЧНЫЙ КАБИНЕТ
            window.location.href = '/';

        } catch (err) {
            console.error('Ошибка при регистрации:', err);

            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                onShowMessage({
                    type: 'error',
                    text: err.message || 'Помилка реєстрації'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Очистка формы при закрытии
    const handleClose = () => {
        setFormData({
            display_name: '',
            email: '',
            password: '',
            password_confirmation: ''
        });
        setErrors({});
        setAcceptTerms(false);
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className="register-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">
                    <img src={logo} alt="Tasty" className="tasty-logo"/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="display_name"
                        placeholder="Ім'я користувача"
                        value={formData.display_name}
                        onChange={handleChange}
                        error={errors.display_name}
                        required
                        className="mb-3"
                    />

                    <Input
                        type="email"
                        name="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        className="mb-3"
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                        className="mb-3"
                    />

                    <Input
                        type="password"
                        name="password_confirmation"
                        placeholder="Повторіть пароль"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        error={errors.password_confirmation}
                        required
                        className="mb-3"
                    />

                    <div className="terms-checkbox mb-3">
                        <Form.Check
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            label={
                                <span>
                                    Я приймаю{' '}
                                    <a href="/terms" target="_blank">Умови використання</a>
                                    {' '}та{' '}
                                    <a href="/privacy" target="_blank">Політику конфіденційності</a>
                                </span>
                            }
                        />
                    </div>

                    <div className="register-button-container">
                        <Button
                            variant="success"
                            type="submit"
                            disabled={loading || !acceptTerms}
                            text={loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Завантаження...
                                </>
                            ) : 'Зареєструватися'}
                            onClick={() => {}}
                            isActive={true}
                            className="register-button"
                        />
                    </div>
                </Form>

                <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                    <span>Вже маєте аккаунт?</span>
                    <button
                        className="login-link"
                        onClick={() => {
                            handleClose();
                            onShowLogin();
                        }}
                    >
                        Увійдіть!
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;