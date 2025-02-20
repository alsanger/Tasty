import { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';
import '../../styles/LoginModal.scss';
import logo from '../../assets/images/logo.svg';

// eslint-disable-next-line react/prop-types
const LoginModal = ({ show, onHide, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Помилка входу');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLoginSuccess?.(data);
            onHide();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="login-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">
                    <img src={logo} alt="Tasty" className="tasty-logo" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Електронна пошта"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="text-end mt-1">
                            <Button
                                variant="link"
                                className="forgot-password"
                            >
                                Забули пароль?
                            </Button>
                        </div>
                    </Form.Group>

                    {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}

                    <Button
                        variant="success"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? (
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
                        ) : 'Увійти'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <span>Вже маєте аккаунт? </span>
                    <Button
                        variant="link"
                        className="register-link"
                        onClick={() => {
                            onHide();
                            // Здесь добавить логику открытия модального окна регистрации
                        }}
                    >
                        Зареєструйтесь!
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;