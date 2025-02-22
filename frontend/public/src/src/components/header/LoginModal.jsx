import {useState} from 'react';
import { userApi } from '../../utils/fetchApi';
import {Modal, Form, Spinner} from 'react-bootstrap';
import {API_BASE_URL, ENDPOINTS} from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import '../../styles/LoginModal.scss';
import logo from '../../assets/images/logo.svg';
import {useUser} from "../../contexts/UserContext.jsx";

const LoginModal = ({show, onHide, onLoginSuccess, onShowRegister}) => {

    const { login } = useUser();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
console.log(`Field ${name} changed to: ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
console.log('Form submitted with data:', formData);
        setLoading(true);
        setError('');

        try {
console.log('Attempting to login...');
            const data = await userApi.login(formData);
console.log('Login response:', data);
            login(data);
            //localStorage.setItem('token', data.token);
            //localStorage.setItem('user', JSON.stringify(data.user));
console.log('Data saved to localStorage');

            //onLoginSuccess?.(data);
            onHide();
        } catch (err) {
console.error('Login error:', err);
            setError(err.message || 'Помилка входу');
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
                <Form onSubmit={(e) => {
                    console.log('Form submit event triggered');
                    handleSubmit(e);
                }}>
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
console.log('Forgot password clicked');
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
console.log('Register clicked');
                        onShowRegister();
                    }}>
                        Зареєструйтесь!
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
