// Файл components/_profilePage/EditProfile/tabs/AccountTab.jsx
import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash, FaCalendarAlt } from 'react-icons/fa';
import Input from '../../../_common/Input/Input';
import Button from '../../../_common/Button/Button';
import { useUser } from '../../../../contexts/UserContext';
import './AccountTab.scss';

const AccountTab = ({
                        formData,
                        onInputChange,
                        errors
                    }) => {
    const { logout } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
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
    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    // Обработчик удаления аккаунта
    const handleDeleteAccount = () => {
        if (window.confirm('Ви впевнені, що хочете видалити свій аккаунт? Ця дія не може бути скасована.')) {
            // Здесь будет вызов API для удаления аккаунта
            logout();
            window.location.href = "/";
        }
    };

    return (
        <div className="account-tab">
            <Form className="account-info-form">
                <Form.Group className="mb-3">
                    <Form.Label>Електронна пошта</Form.Label>
                    <Form.Control
                        type="email"
                        value={formData.email || ''}
                        disabled
                        readOnly
                        className="readonly-input"
                    />
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
                    <h4>Вийти з аккаунту</h4>
                    <p>Завершіть сеанс на цьому пристрої. Для повторного входу знадобиться ваша електронна пошта та пароль.</p>
                    <Button
                        text="Вийти"
                        onClick={handleLogout}
                        variant="default"
                    />
                </div>

                <div className="section-divider delete-account">
                    <h4>Видалення аккаунту та данних</h4>
                    <p>Безповоротне видалення данних та всього, що пов'язано з обліковим записом.</p>
                    <Button
                        text="Видалити аккаунт"
                        onClick={handleDeleteAccount}
                        variant="default"
                    />
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