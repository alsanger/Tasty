// Файл components/_profilePage/EditProfile/tabs/BasicInfoTab.jsx
import React, { useState, useRef } from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../../_common/Input/Input';
import { BASE_URL } from '../../../../utils/constants';
import { RxAvatar } from 'react-icons/rx';
import ImageUploader from '../../../_common/ImageUploader/ImageUploader';
import { ENDPOINTS } from '../../../../utils/constants';
import './BasicInfoTab.scss';
import Button from "../../../_common/Button/Button.jsx";

const BasicInfoTab = ({
                          formData,
                          onInputChange,
                          errors,
                          userId,
                          tempAvatarPreview,
                          onAvatarChange
                      }) => {
    // Ссылка на скрытый input для загрузки файла
    const fileInputRef = useRef(null);

    // Определяем URL аватарки - временный или из formData
    const avatarUrl = tempAvatarPreview || (formData.avatar_url
        ? (formData.avatar_url.startsWith('http')
            ? formData.avatar_url
            : `${BASE_URL}${formData.avatar_url}`)
        : null);

    // Обработчик клика по кнопке загрузки аватарки
    const handleAvatarButtonClick = () => {
        // Вызываем клик на скрытом input
        fileInputRef.current.click();
    };

    // Обработчик выбора файла
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Создаем временный URL для превью
            const previewUrl = URL.createObjectURL(file);

            // Передаем файл и превью в родительский компонент
            onAvatarChange(file, previewUrl);
        }
    };

    return (
        <div className="basic-info-tab">
            <h3>Основна інформація</h3>
            <div className="avatar-section">
                <div className="avatar-container">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Аватар користувача" className="user-avatar" />
                    ) : (
                        <RxAvatar className="default-avatar" size={100} />
                    )}
                </div>

                {/* Скрытый input для выбора файла */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {/* Кнопка для выбора аватарки */}
                <Button
                    text="Змінити фото"
                    onClick={handleAvatarButtonClick}
                    variant="default"
                />
            </div>

            <Form className="user-info-form">
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ім'я</Form.Label>
                            <Input
                                type="text"
                                name="first_name"
                                placeholder="Ім'я"
                                value={formData.first_name || ''}
                                onChange={(e) => onInputChange('first_name', e.target.value)}
                                error={errors?.first_name}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Фамілія</Form.Label>
                            <Input
                                type="text"
                                name="last_name"
                                placeholder="Фамілія"
                                value={formData.last_name || ''}
                                onChange={(e) => onInputChange('last_name', e.target.value)}
                                error={errors?.last_name}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Опис</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Розскажіть про себе"
                        value={formData.description || ''}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        className={errors?.description ? 'error' : ''}
                        rows={4}
                    />
                    {errors?.description && (
                        <Form.Text className="text-danger">{errors.description}</Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ім'я користувача</Form.Label>
                    <Input
                        type="text"
                        name="display_name"
                        placeholder="Ім'я користувача"
                        value={formData.display_name || ''}
                        onChange={(e) => onInputChange('display_name', e.target.value)}
                        error={errors?.display_name}
                        required
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

BasicInfoTab.propTypes = {
    formData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    userId: PropTypes.number,
    tempAvatarPreview: PropTypes.string,
    onAvatarChange: PropTypes.func
};

export default BasicInfoTab;