import CryptoJS from 'crypto-js';

const RESET_TOKENS_KEY = 'password-reset-tokens';

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  // Generate a secure token
  const token = CryptoJS.lib.WordArray.random(32).toString();
  const expiresAt = Date.now() + 3600000; // 1 hour expiration

  // Store the token (in a real app, this would be in a database)
  const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
  tokens[email] = { token, expiresAt };
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));

  // In a real app, this would send an actual email
  console.log(`Password reset link for ${email}: /reset-password?token=${token}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const verifyResetToken = (token: string): boolean => {
  const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
  
  for (const [email, data] of Object.entries(tokens)) {
    if (data.token === token && data.expiresAt > Date.now()) {
      return true;
    }
  }
  
  return false;
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const tokens = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || '{}');
  
  // Find the email associated with the token
  const email = Object.entries(tokens).find(([_, data]) => data.token === token)?.[0];
  
  if (!email) {
    throw new Error('Invalid or expired token');
  }
  
  // In a real app, this would update the password in the database
  console.log(`Password reset for ${email} successful`);
  
  // Remove the used token
  delete tokens[email];
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
};