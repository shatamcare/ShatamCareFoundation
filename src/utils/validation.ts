// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string, minLength: number = 1): boolean => {
  return value.trim().length >= minLength;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateContactForm = (data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!validateRequired(data.name, 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!validateRequired(data.email) || !validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }

  if (!validateRequired(data.subject, 3)) {
    errors.push('Subject must be at least 3 characters long');
  }

  if (!validateRequired(data.message, 10)) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
