// src/utils/validation.ts

export function validateInput(input: any, type: string): boolean {
    switch (type) {
        case 'text':
            return validateText(input);
        case 'number':
            return validateNumber(input);
        case 'email':
            return validateEmail(input);
        case 'date':
            return validateDate(input);
        default:
            return false;
    }
}

function validateText(input: any): boolean {
    return typeof input === 'string' && input.trim().length > 0;
}

function validateNumber(input: any): boolean {
    return !isNaN(input) && input !== null && input !== '';
}

function validateEmail(input: any): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

function validateDate(input: any): boolean {
    return !isNaN(Date.parse(input));
}
