// Файл components/_profilePage/EditProfile/tabs/AccountTab.jsx
import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash, FaCalendarAlt } from 'react-icons/fa';
import Input from '../../../_common/Input/Input';
import Button from '../../../_common/Button/Button';
import { useUser } from '../../../../contexts/UserContext';
import './AccountTab.scss';
import {deleteUser, logout} from "../../../../utils/fetchApi/userApi.js";

const AccountTab = ({
                        formData,
                        onInputChange,
                        errors
                    }) => {
    const { user, logout } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');

    // Переключение видимости пароля
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Переключение видимости подтверждения пароля
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Валидация пароля
    const validatePassword = (value) => {
        if (value && value.length < 8) {
            setPasswordError('Пароль повинен містити щонайменше 8 символів');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Валидация подтверждения пароля
    const validateConfirmPassword = (value) => {
        if (password && value !== password) {
            setConfirmPasswordError('Паролі не співпадають');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    // Валидация телефона
    const validatePhone = (value) => {
        if (!value) return true;

        // Проверка на максимальную длину
        if (value.length > 25) {
            setPhoneError('Номер телефону не може перевищувати 25 символів');
            return false;
        }

        // Подсчет специальных символов
        const plusCount = (value.match(/\+/g) || []).length;
        const openParenCount = (value.match(/\(/g) || []).length;
        const closeParenCount = (value.match(/\)/g) || []).length;

        // Проверка допустимых символов
        const isValidChar = /^[\d\+\(\)]+$/.test(value);

        if (!isValidChar || plusCount > 1 || openParenCount > 1 || closeParenCount > 1) {
            setPhoneError('Номер повинен містити тільки цифри та по одному символу +()');
            return false;
        }

        setPhoneError('');
        return true;
    };

    // Валидация даты рождения
    const validateBirthdate = (value) => {
        if (!value) return true;

        const birthDate = new Date(value);
        const minDate = new Date('1900-01-01');

        // Максимальная дата - сегодня минус 7 лет
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 7, today.getMonth(), today.getDate());

        if (birthDate < minDate) {
            setBirthdateError('Дата народження не може бути раніше 01.01.1900');
            return false;
        }

        if (birthDate > maxDate) {
            setBirthdateError('Користувачу має бути щонайменше 7 років');
            return false;
        }

        setBirthdateError('');
        return true;
    };

    // Обработчик изменения пароля
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);

        // Если поле подтверждения не пустое, проверяем совпадение
        if (confirmPassword) {
            validateConfirmPassword(confirmPassword);
        }
    };

    // Обработчик изменения подтверждения пароля
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value);
    };

    // Обработчик изменения телефона
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (validatePhone(value)) {
            onInputChange('phone', value);
        }
    };

    // Обработчик изменения даты рождения
    const handleBirthdateChange = (e) => {
        const value = e.target.value;
        if (validateBirthdate(value)) {
            onInputChange('birthdate', value);
        }
    };

    // Обработчик выхода из аккаунта
    const handleLogout = async () => {
        try {
            // 1. Выполняем выход
            await logout();

            // 2. Очищаем клиентское состояние
            localStorage.clear(); // Очищаем localStorage (если там есть токен)
            sessionStorage.clear(); // Аналогично для sessionStorage

            // 3. Сбрасываем кеш запросов
            if (window.queryClient) {
                queryClient.clear();
            }

            // 4. Перенаправляем на главную
            window.location.href = '/'; // Или '/login' если нужно

        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    // Обработчик удаления аккаунта
    const handleDeleteAccount = async () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій аккаунт?')) {
            try {
                // 1. Сначала удаляем аккаунт (пока токен действителен)
                await deleteUser(user.id);

                // 2. Затем выходим (отправляем POST на /logout)
                await logout();

                // 3. Дополнительная очистка
                sessionStorage.clear();
                if (window.queryClient) queryClient.clear();
                window.location.href = '/';
            } catch (error) {
                console.error('Ошибка при удалении:', error);
                // Показываем пользователю сообщение об ошибке
                alert('Не вдалося видалити акаунт. Спробуйте ще раз.');
            }
        }
    };

    return (
        <div className="account-tab">
            <h3>Управління аккаунтом</h3>
            <Form className="account-info-form">
                <Form.Group className="mb-3">
                    <Form.Label>Електронна пошта</Form.Label>
                    <Form.Control
                        type="email"
                        value={user.email || ''}
                        disabled
                        readOnly
                        className="readonly-input"
                    />
                </Form.Group>

                <Form.Group className="mb-3 password-field">
                    <Form.Label>Пароль</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className={passwordError ? 'error' : ''}
                        />
                        <div className="password-toggle" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {passwordError && (
                        <Form.Text className="text-danger">{passwordError}</Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3 password-field">
                    <Form.Label>Підтвердження паролю</Form.Label>
                    <div className="password-input-container">
                        <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="••••••••"
                            className={confirmPasswordError ? 'error' : ''}
                        />
                        <div className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {confirmPasswordError && (
                        <Form.Text className="text-danger">{confirmPasswordError}</Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Номер телефону</Form.Label>
                    <Input
                        type="text"
                        name="phone"
                        placeholder="+380"
                        value={formData.phone || ''}
                        onChange={handlePhoneChange}
                        error={phoneError}
                    />
                </Form.Group>

                <Form.Group className="mb-3 date-field">
                    <Form.Label>Дата народження</Form.Label>
                    <div className="date-input-container">
                        <Form.Control
                            type="date"
                            name="birthdate"
                            value={formData.birthdate || ''}
                            onChange={handleBirthdateChange}
                            className={birthdateError ? 'error' : ''}
                        />
                        <div className="date-icon">
                            <FaCalendarAlt />
                        </div>
                    </div>
                    {birthdateError && (
                        <Form.Text className="text-danger">{birthdateError}</Form.Text>
                    )}
                </Form.Group>

                <div className="section-divider">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div>
                                <h4>Вийти з аккаунту</h4>
                                <p>Завершіть сеанс на цьому пристрої. Для повторного входу знадобиться ваша електронна пошта та пароль.</p>
                            </div>
                        </Col>
                        <Col md={4} className="button-col">
                            <Button
                                text="Вийти"
                                className="logout-button custom-button"
                                onClick={handleLogout}
                                variant="default"
                            />
                        </Col>
                    </Row>
                </div>

                <div className="section-divider delete-account">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div>
                                <h4>Видалення аккаунту та данних</h4>
                                <p>Безповоротне видалення данних та всього, що пов'язано з обліковим записом.</p>
                            </div>
                        </Col>
                        <Col md={4} className="button-col">
                            <Button
                                text="Видалити аккаунт"
                                className="delete-button custom-button"
                                onClick={handleDeleteAccount}
                                variant="default"
                            />
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
    );
};

AccountTab.propTypes = {
    formData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default AccountTab;