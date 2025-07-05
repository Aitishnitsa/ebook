import { useState, useCallback } from 'react';

export const useValidation = () => {
    const [errors, setErrors] = useState({});

    const validationRules = {
        username: (value) => {
            const errors = [];
            if (!value || value.length < 3) {
                errors.push('Мінімум 3 символи');
            }
            if (value && value.length > 50) {
                errors.push('Максимум 50 символів');
            }
            if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
                errors.push('Тільки літери, цифри та підкреслення');
            }
            return errors;
        },

        email: (value) => {
            const errors = [];
            if (!value) {
                errors.push('Email обов\'язковий');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push('Неправильний формат email');
            }
            return errors;
        },

        password: (value, options = {}) => {
            const errors = [];
            const { isRequired = true, minLength = 8 } = options;

            if (isRequired && !value) {
                errors.push('Пароль обов\'язковий');
            }

            if (value) {
                if (value.length < minLength) {
                    errors.push(`Мінімум ${minLength} символів`);
                }
                if (value.length > 100) {
                    errors.push('Максимум 100 символів');
                }
                if (!/(?=.*[a-zA-Z])/.test(value)) {
                    errors.push('Щонайменше одна літера');
                }
            }
            return errors;
        },

        // Для реєстрації пароль має бути довшим
        passwordRegister: (value) => {
            const errors = [];
            if (!value) {
                errors.push('Пароль обов\'язковий');
            } else {
                if (value.length < 8) {
                    errors.push('Мінімум 8 символів');
                }
                if (value.length > 100) {
                    errors.push('Максимум 100 символів');
                }
                if (!/(?=.*[a-zA-Z])/.test(value)) {
                    errors.push('Щонайменше одна літера');
                }
            }
            return errors;
        },

        // Для профілю пароль не обов'язковий
        passwordProfile: (value) => {
            if (!value) return [];
            const errors = [];
            if (value.length < 8) {
                errors.push('Мінімум 8 символів');
            }
            if (value.length > 100) {
                errors.push('Максимум 100 символів');
            }
            if (!/(?=.*[a-zA-Z])/.test(value)) {
                errors.push('Щонайменше одна літера');
            }
            return errors;
        }
    };

    const validateField = useCallback((fieldName, value, options = {}) => {
        const rule = validationRules[fieldName];
        if (!rule) {
            console.warn(`Validation rule for field "${fieldName}" not found`);
            return [];
        }

        const fieldErrors = rule(value, options);

        setErrors(prev => ({
            ...prev,
            [fieldName]: fieldErrors
        }));

        return fieldErrors;
    }, []);

    const validateForm = useCallback((formData, fieldRules = {}) => {
        const newErrors = {};
        let isValid = true;

        Object.entries(formData).forEach(([fieldName, value]) => {
            const ruleKey = fieldRules[fieldName] || fieldName;
            const rule = validationRules[ruleKey];

            if (rule) {
                const fieldErrors = rule(value, fieldRules.options?.[fieldName]);
                newErrors[fieldName] = fieldErrors;

                if (fieldErrors.length > 0) {
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return { isValid, errors: newErrors };
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFieldError = useCallback((fieldName) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: []
        }));
    }, []);

    const isFormValid = useCallback(() => {
        return Object.values(errors).every(fieldErrors =>
            !fieldErrors || fieldErrors.length === 0
        );
    }, [errors]);

    const getFieldErrors = useCallback((fieldName) => {
        return errors[fieldName] || [];
    }, [errors]);

    const hasFieldErrors = useCallback((fieldName) => {
        const fieldErrors = errors[fieldName];
        return fieldErrors && fieldErrors.length > 0;
    }, [errors]);

    const addFieldError = useCallback((fieldName, errorMessage) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), errorMessage]
        }));
    }, []);

    return {
        errors,
        setErrors,
        validationRules,
        validateField,
        validateForm,
        clearErrors,
        clearFieldError,
        isFormValid,
        getFieldErrors,
        hasFieldErrors,
        addFieldError
    };
};

export default useValidation;
