import {useState} from 'react';
import {userApi} from '../../../../utils/fetchApi/index.js';
import {Modal, Form, Spinner} from 'react-bootstrap';
import Input from '../../Input/Input.jsx';
import Button from '../../Button/Button.jsx';
import './RegisterModal.scss';
import logo from '../../../../assets/images/logo.svg';
import {useUser} from "../../../../contexts/UserContext.jsx";
import {validateRegisterForm} from "./RegisterModalValidation.js";
import {useModal} from "../../../../contexts/ModalContext.jsx";

const RegisterModal = ({show, onHide}) => {
    const {login} = useUser();
    const { showModal } = useModal();

    const [formData, setFormData] = useState({
        display_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        checkbox: false
    });

    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Поле ${name} изменено на: ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginClick = () => {
        onHide(); // Закрываем текущее модальное окно
        showModal('login'); // Открываем модальное окно входа
    };

    const validateForm = () => {
        const { isValid, errors: newErrors } = validateRegisterForm(formData);
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await userApi.register(formData);
            console.log("Регистрация успешна:", response);

            if (response.data) {
                // Преобразуем данные от API регистрации в формат, ожидаемый функцией login
                const loginData = {
                    user: response.data,
                    token: response.data.token
                };

                // Используем контекст для входа, как в LoginModal
                login(loginData);
                setErrors({});
                onHide();
            } else {
                throw new Error('Неверный формат ответа от сервера');
            }
        } catch (err) {
            console.error("Ошибка при регистрации:", err);

            if (err.response?.data) {
                const { message, errors } = err.response.data;

                const serverErrors = {};
                if (message) {
                    serverErrors.general = message;
                }
                if (errors) {
                    Object.entries(errors).forEach(([key, messages]) => {
                        serverErrors[key] = Array.isArray(messages) ? messages.join('. ') : messages;
                    });
                }

                setErrors(serverErrors);
            } else {
                setErrors({
                    general: "Помилка з'єднання з сервером. Спробуйте пізніше."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            display_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            checkbox: false
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
                            name="checkbox"
                            id="acceptTerms"
                            checked={formData.checkbox}
                            onChange={(e) => {
                                setAcceptTerms(e.target.checked);
                                setFormData(prev => ({
                                    ...prev,
                                    checkbox: e.target.checked
                                }));
                            }}
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

                    {Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger py-2">
                            <ul>
                                {errors.general && <li>{errors.general}</li>} {/* Общая ошибка */}
                                {Object.entries(errors).map(([key, message]) => {
                                    if (key !== 'general') { // Пропускаем общую ошибку
                                        return <li key={key}>{message}</li>;
                                    }
                                    return null;
                                })}
                            </ul>
                        </div>
                    )}

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
                        onClick={handleLoginClick}
                    >
                        Увійдіть!
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;
