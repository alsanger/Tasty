// Компонент src/components/recipe/RecipeStepsForm.jsx
import React, {useEffect, useState} from 'react';
import { Form, Button as BootstrapButton } from 'react-bootstrap';
import { CiImageOn } from 'react-icons/ci';
import { RiDeleteBinLine } from 'react-icons/ri';
import Button from '../../_common/Button/Button';
import './RecipeStepsForm.scss';

const RecipeStepsForm = ({ onChange, steps: externalSteps = [] }) => {
    const [steps, setSteps] = useState([{
        id: Date.now(),
        description: '',
        image: null,
        imagePreview: null,
        step_number: 1
    }]);


    // Следим за изменением внешних шагов (например, при сбросе формы)
    useEffect(() => {
        if (externalSteps.length === 0) return;
        setSteps(externalSteps);
    }, [externalSteps]);


    // Добавление нового шага
    const handleAddStep = () => {
        const newStep = {
            id: Date.now(), // временный id для локального управления
            description: '',
            image: null,
            imagePreview: null,
            step_number: steps.length + 1
        };

        const updatedSteps = [...steps, newStep];
        setSteps(updatedSteps);

        if (onChange) {
            onChange(updatedSteps);
        }
    };

    // Изменение описания шага
    const handleStepDescriptionChange = (id, description) => {
        const updatedSteps = steps.map(step =>
            step.id === id ? { ...step, description } : step
        );
        setSteps(updatedSteps);

        if (onChange) {
            onChange(updatedSteps);
        }
    };

    // Обработка выбора изображения
    const handleStepImageChange = (id, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const updatedSteps = steps.map(step => {
            if (step.id === id) {
                return {
                    ...step,
                    image: file,
                    imagePreview: URL.createObjectURL(file)
                };
            }
            return step;
        });

        setSteps(updatedSteps);

        if (onChange) {
            onChange(updatedSteps);
        }
    };

    // Удаление шага
    const handleRemoveStep = (id) => {
        let updatedSteps = steps.filter(step => step.id !== id);

        // Обновляем номера шагов
        updatedSteps = updatedSteps.map((step, index) => ({
            ...step,
            step_number: index + 1
        }));

        setSteps(updatedSteps);

        if (onChange) {
            onChange(updatedSteps);
        }
    };

    return (
        <div className="recipe-steps-form">
            {steps.map((step, index) => (
                <div key={step.id} className="recipe-step-item">
                    <Form.Group className="step-description mb-3">
                        <Form.Label>Рецепт</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={step.description}
                            onChange={(e) => handleStepDescriptionChange(step.id, e.target.value)}
                            placeholder={`${step.step_number} крок`}
                        />
                        <BootstrapButton
                            variant="link"
                            className="remove-step-btn"
                            onClick={() => handleRemoveStep(step.id)}
                        >
                            <RiDeleteBinLine />
                        </BootstrapButton>
                    </Form.Group>

                    <div className="step-image-wrapper">
                        <input
                            type="file"
                            id={`step-image-${step.id}`}
                            className="d-none"
                            accept="image/*"
                            onChange={(e) => handleStepImageChange(step.id, e)}
                        />
                        <label htmlFor={`step-image-${step.id}`} className="step-image-label">
                            {step.imagePreview ? (
                                <img src={step.imagePreview} alt={`Шаг ${step.step_number}`} className="step-image-preview" />
                            ) : (
                                <div className="step-image-placeholder">
                                    <CiImageOn size={32} />
                                </div>
                            )}
                        </label>
                    </div>
                </div>
            ))}

            <div className="add-step mb-3">
            <Button
                text="+ Додати крок"
                onClick={handleAddStep}
                variant="default"
            />
            </div>
        </div>
    );
};

export default RecipeStepsForm;