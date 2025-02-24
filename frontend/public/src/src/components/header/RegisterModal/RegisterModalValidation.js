// Функция валидации формы регистрации
export const validateRegisterForm = (formData) => {
    const errors = {};

    // Валидация имени пользователя
    if (!formData.display_name?.trim()) {
        errors.display_name = "Ім'я користувача є обов'язковим";
    } else if (formData.display_name.length < 3) {
        errors.display_name = "Ім'я користувача повинно містити мінімум 3 символи";
    } else if (formData.display_name.length > 255) {
        errors.display_name = "Ім'я користувача є занадто довгим";
    }

    // Валидация email
    if (!formData.email) {
        errors.email = "Email є обов'язковим";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Невірний формат email";
    }

    // Валидация пароля
    if (!formData.password) {
        errors.password = "Пароль є обов'язковим";
    } else if (formData.password.length < 8) {
        errors.password = "Пароль повинен містити мінімум 8 символів";
    }

    // Валидация подтверждения пароля
    if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "Паролі не співпадають";
    }

    // Валидация чекбокса
    if (formData.checkbox === false) {
        errors.checkbox = "Обов'язковою умовою є прийнятя Умов використання та Політики конфіденційності";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};