// Файл components/_profilePage/EditProfile/tabs/PrivacyTab.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './PrivacyTab.scss';

const PrivacyTab = ({
                        formData,
                        onInputChange,
                        errors
                    }) => {
    // Обработчик изменения переключателя приватности профиля
    const handlePrivateProfileChange = (e) => {
        onInputChange('private_profile', e.target.checked);
    };

    // Обработчик изменения переключателя комментариев
    const handleCommentsEnabledChange = (e) => {
        onInputChange('comments_enabled', e.target.checked);
    };

    // Обработчик изменения настроек упоминаний
    const handleMentionsSettingChange = (e) => {
        onInputChange('mentions_setting', e.target.value);
    };

    return (
        <div className="privacy-tab">
            <h3>Видимість профілю</h3>

            <div className="privacy-section">
                <p>Приватний профіль</p>
                <div className="privacy-option">
                    <div className="privacy-option-text">
                        <p>Якщо у вас приватний профіль, тільки схвалені вами люди можуть переглядати його, а також ваші рецепти, підписників та підписки.</p>
                    </div>
                    <Form.Check
                        type="switch"
                        id="private-profile-switch"
                        checked={formData.private_profile || false}
                        onChange={handlePrivateProfileChange}
                    />
                </div>
            </div>

            <div className="privacy-section">
                <h4>Дозволи для спільноти</h4>
                <div className="mentions-options">
                    <p className="mentions-label">@згадки</p>
                    <p className="mentions-description">Виберіть користувачів, які можуть вас згадувати:</p>

                    <div className="radio-options">
                        <Form.Check
                            type="radio"
                            name="mentions-setting"
                            id="mentions-all"
                            label="Усі користувачі"
                            value="all"
                            checked={formData.mentions_setting === 'all'}
                            onChange={handleMentionsSettingChange}
                            className="custom-radio"
                        />

                        <Form.Check
                            type="radio"
                            name="mentions-setting"
                            id="mentions-followers"
                            label="Тільки користувачі, на яких ви підписані"
                            value="followers"
                            checked={formData.mentions_setting === 'followers'}
                            onChange={handleMentionsSettingChange}
                            className="custom-radio"
                        />

                        <Form.Check
                            type="radio"
                            name="mentions-setting"
                            id="mentions-nobody"
                            label="Вимкнути (ніхто не зможе вас згадувати)"
                            value="nobody"
                            checked={formData.mentions_setting === 'nobody'}
                            onChange={handleMentionsSettingChange}
                            className="custom-radio"
                        />
                    </div>
                </div>
            </div>

            <div className="privacy-section">
                <h4>Коментарі</h4>
                <div className="privacy-option">
                    <div className="privacy-option-text">
                        <p>Дозволити коментування ваших рецептів</p>
                        <p className="sub-description">Коментарі будуть включені за замовчуванням для ваших нових та існуючих рецептів.</p>
                    </div>
                    <Form.Check
                        type="switch"
                        id="comments-enabled-switch"
                        checked={formData.comments_enabled || false}
                        onChange={handleCommentsEnabledChange}
                    />
                </div>
            </div>
        </div>
    );
};

PrivacyTab.propTypes = {
    formData: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default PrivacyTab;