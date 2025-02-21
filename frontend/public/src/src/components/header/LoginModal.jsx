import {useState} from 'react';
import {Modal, Form, Spinner} from 'react-bootstrap';
import {API_BASE_URL, ENDPOINTS} from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import '../../styles/LoginModal.scss';
import logo from '../../assets/images/logo.svg';

const LoginModal = ({show, onHide, onLoginSuccess}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
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
                    <img src={logo} alt="Tasty" className="tasty-logo"/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mb-3"
                    />

                    <div className="mb-3">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="forgot-password-container">
                            <button className="forgot-password" onClick={() => {
                            }}>
                                Забули пароль?
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}
                    <div className="enter-password-container">
                        <Button
                            variant="success"
                            type="submit"
                            disabled={loading}
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
                            ) : '\u00A0\u00A0\u00A0Увійти\u00A0\u00A0\u00A0'}
                            onClick={() => {
                            }}
                            isActive={true}
                            className="login-button"
                        />
                    </div>
                </Form>

                <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                    <span>Ще не маєте аккаунт?</span>
                    <button className="register-link" onClick={() => {
                    }}>
                        Зареєструйтесь!
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
