export function validateEmail(email) {
  // Email must contain @ and .
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Password must contain at least 8 characters
  return password.length >= 8;
}
