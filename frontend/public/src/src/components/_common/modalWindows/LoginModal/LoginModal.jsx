import {useState} from 'react';
import { userApi } from '../../../../utils/fetchApi/index.js';
import {Modal, Form, Spinner} from 'react-bootstrap';
import Input from '../../Input/Input.jsx';
import Button from '../../Button/Button.jsx';
import './LoginModal.scss';
import logo from '../../../../assets/images/logo.svg';
import {useUser} from "../../../../contexts/UserContext.jsx";
import {useModal} from "../../../../contexts/ModalContext.jsx";

const LoginModal = ({show, onHide}) => {

    const { login } = useUser();
    const { showModal } = useModal();

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

    const handleRegisterClick = () => {
        onHide(); // Закрываем текущее модальное окно
        showModal('register'); // Открываем модальное окно регистрации
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await userApi.login(formData);
            console.log('Ответ с сервера по логину:', data);
            login(data);
            onHide();
        } catch (err) {
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
                            variant="default"
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
                            onClick={() => {}}
                            isActive={true}
                            className="login-button"
                        />
                    </div>
                </Form>

                <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                    <span>Ще не маєте аккаунт?</span>
                    <button className="register-link" onClick={handleRegisterClick}>
                        Зареєструйтесь!
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
