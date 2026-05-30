export function validateEmail(email: string): string | null {
  if (!email) return null; // don't show error if empty (required handles that)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? null : "Please enter a valid email address";
}

export function validatePassword(password: string): string | null {
  if (!password) return null;
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirm: string
): string | null {
  if (!confirm) return null;
  return password === confirm ? null : "Passwords do not match";
}

export function validateRequired(
  value: string,
  fieldName: string
): string | null {
  return value.trim() ? null : `${fieldName} is required`;
}

export function validatePrice(price: string): string | null {
  if (!price) return null;
  const num = parseFloat(price);
  if (isNaN(num) || num <= 0) return "Price must be greater than 0";
  return null;
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): string | null {
  if (!value) return null;
  if (value.length < min)
    return `${fieldName} must be at least ${min} characters`;
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): string | null {
  if (!value) return null;
  if (value.length > max)
    return `${fieldName} must be at most ${max} characters`;
  return null;
}
