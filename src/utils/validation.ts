export const validateInput = (input: string, type: string): boolean => {
  switch (type) {
    case 'text':
      return /^[a-zA-Z0-9 ]+$/.test(input);
    case 'number':
      return /^[0-9]+$/.test(input);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    default:
      return false;
  }
};
