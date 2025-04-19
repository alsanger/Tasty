// Файл components/_profilePage/EditProfile/EditProfile.jsx
import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Nav, Tab} from 'react-bootstrap';
import {useUser} from '../../../contexts/UserContext';
import {getUserById, updateUser} from '../../../utils/fetchApi/userApi';
import Button from '../../_common/Button/Button';
import BasicInfoTab from './tabs/BasicInfoTab';
import './EditProfile.scss';
import {ENDPOINTS} from "../../../utils/constants.js";
import {uploadImage} from "../../../utils/fetchApi/image.js";
import AccountTab from "./tabs/AccountTab.jsx";
import PrivacyTab from "./tabs/PrivacyTab.jsx";

const EditProfile = () => {
    const {user, updateUserData} = useUser();
    const [activeKey, setActiveKey] = useState('basic');
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    // Добавляем состояние для хранения временного превью аватарки
    const [tempAvatarPreview, setTempAvatarPreview] = useState(null);
    // Добавляем состояние для файла аватарки
    const [avatarFile, setAvatarFile] = useState(null);

    // При загрузке данных сохраняем исходные значения
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    setIsLoading(true);
                    const response = await getUserById(user.id);
                    const userData = response.data;

                    setProfileData(userData);
                    const initialFormData = {
                        display_name: userData.display_name || '',
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || '',
                        phone: userData.phone || '',
                        address: userData.address || '',
                        birthdate: userData.birthdate || '',
                        avatar_url: userData.avatar_url || '',
                        description: '',

                        private_profile: userData.private_profile || false,
                        comments_enabled: userData.comments_enabled || false,
                        mentions_setting: userData.mentions_setting || 'all'
                    };

                    setFormData(initialFormData);
                    setOriginalData(JSON.stringify(initialFormData));
                    setIsLoading(false);
                } catch (error) {
                    console.error('Ошибка при загрузке данных пользователя:', error);
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user?.id]);

    // Обработчик изменения данных формы
    const handleInputChange = (name, value) => {
        setFormData(prev => {
            const newData = {...prev, [name]: value};
            // Проверяем наличие изменений
            setHasChanges(JSON.stringify(newData) !== originalData || tempAvatarPreview !== null);
            return newData;
        });
    };

    // Обработчик изменения аватарки - только для превью
    const handleAvatarPreview = (file, previewUrl) => {
        setTempAvatarPreview(previewUrl);
        setAvatarFile(file);
        // Активировать кнопки
        setHasChanges(true);
    };

    // Обработчик отмены изменений
    const handleCancel = () => {
        if (originalData) {
            setFormData(JSON.parse(originalData));
            // Сбрасываем превью и файл аватарки
            setTempAvatarPreview(null);
            setAvatarFile(null);
            setHasChanges(false);
        }
    };

    // Обработчик сохранения данных
    const handleSave = async () => {
        if (user?.id) {
            try {
                setIsLoading(true);
                // Если есть новая аватарка, сначала загружаем её
                // Если есть новая аватарка, сначала загружаем её
                if (avatarFile) {
                    try {
                        const response = await uploadImage(avatarFile, ENDPOINTS.IMAGE.UPLOAD_USER_AVATAR, user.id);
                        if (response && response.image_url) {
                            console.log('Получили новый адрес аватарки: ', response.image_url);

                            // Напрямую используем полученный URL
                            const updatedData = {
                                display_name: formData.display_name,
                                first_name: formData.first_name,
                                last_name: formData.last_name,
                                phone: formData.phone,
                                address: formData.address,
                                birthdate: formData.birthdate,
                                avatar_url: response.image_url // Используем новый URL
                            };

                            await updateUser(user.id, updatedData);

                            // Обновляем UserContext с новой аватаркой
                            updateUserData({
                                avatarUrl: response.image_url,
                                // Добавьте другие поля, которые также могли измениться
                                displayName: formData.display_name,
                                firstName: formData.first_name,
                                lastName: formData.last_name,
                                phone: formData.phone,
                                address: formData.address,
                                birthdate: formData.birthdate
                            });
                        }
                    } catch (uploadError) {
                        console.error('Ошибка при загрузке аватарки:', uploadError);
                    }
                } else {
                    // Если нет новой аватарки, используем текущие данные
                    const updatedData = {
                        display_name: formData.display_name,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        phone: formData.phone,
                        address: formData.address,
                        birthdate: formData.birthdate,
                        avatar_url: formData.avatar_url
                    };

                    await updateUser(user.id, updatedData);

                    // Обновляем UserContext
                    updateUserData({
                        avatarUrl: formData.avatar_url,
                        displayName: formData.display_name,
                        firstName: formData.first_name,
                        lastName: formData.last_name,
                        phone: formData.phone,
                        address: formData.address,
                        birthdate: formData.birthdate
                    });
                }

                // Обновляем данные профиля после успешного сохранения
                const refreshedData = await getUserById(user.id);
                setProfileData(refreshedData.data);

                // Очищаем временное превью и файл
                setTempAvatarPreview(null);
                setAvatarFile(null);

                // Обновляем оригинальные данные
                setOriginalData(JSON.stringify({
                    ...refreshedData.data,
                    description: '' // Сохраняем пустое описание как было изначально
                }));

                setHasChanges(false);
                setIsLoading(false);

                // Перезагружаем страницу для обновления хедера
                window.location.reload();
            } catch (error) {
                console.error('Ошибка при обновлении данных пользователя:', error);
                setIsLoading(false);
            }
        }
    };

    if (isLoading && !profileData) {
        return <div className="loading-spinner">Загрузка...</div>;
    }

    return (
        // В EditProfile.jsx изменить структуру Row/Col:
        <Container className="edit-profile-container">
            <Tab.Container activeKey={activeKey} onSelect={k => setActiveKey(k)}>
                <div className="profile-layout">
                    <div className="sidebar-container">
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="basic">Редагування профілю</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="account">Управління аккаунтом</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="privacy">Конфіденційність</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <div className="content-container">
                        <Tab.Content>
                            <Tab.Pane eventKey="basic">
                                <BasicInfoTab
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    errors={errors}
                                    userId={user?.id}
                                    tempAvatarPreview={tempAvatarPreview}
                                    onAvatarChange={handleAvatarPreview}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="account">
                                <AccountTab
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    errors={errors}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="privacy">
                                <PrivacyTab
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    errors={errors}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </div>
            </Tab.Container>
            <div className="action-buttons-container">
                <div className="action-buttons">
                    <Button
                        text="Скасувати зміни"
                        onClick={handleCancel}
                        variant="default"
                        isActive={hasChanges}
                    />
                    <Button
                        text="Зберегти"
                        onClick={handleSave}
                        isActive={hasChanges}
                    />
                </div>
            </div>
        </Container>
    );
};

export default EditProfile;