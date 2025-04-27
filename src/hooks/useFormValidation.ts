
import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((
    fieldName: string,
    value: any,
    rules: ValidationRules
  ): string => {
    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return `Mínimo de ${rules.minLength} caracteres`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Máximo de ${rules.maxLength} caracteres`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }
    if (rules.custom && !rules.custom(value)) {
      return 'Valor inválido';
    }
    return '';
  }, []);

  const validateForm = useCallback((
    values: { [key: string]: any },
    rules: { [key: string]: ValidationRules }
  ): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName], rules[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  return { errors, validateForm, validateField };
}
