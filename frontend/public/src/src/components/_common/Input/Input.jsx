import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import "./Input.scss";

const Input = ({
                   type = 'text',
                   name,
                   placeholder,
                   value,
                   onChange,
                   required = false,
                   className = '',
                   error = ''
               }) => {
    return (
        <Form.Group className={`custom-input ${className}`}>
            <Form.Control
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={error ? 'error' : ''}
            />
            {error && (
                <Form.Text className="text-danger">{error}</Form.Text> // Отображаем текст ошибки
            )}
        </Form.Group>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
    error: PropTypes.string // Добавляем проверку типа для ошибки
};

export default Input;