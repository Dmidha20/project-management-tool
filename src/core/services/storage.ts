/**
 * localStorage utility for persisting auth token
 */

const TOKEN_KEY = 'auth_token';

export const storage = {
  /**
   * Save token to localStorage
   */
  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Clear all auth-related storage
   */
  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
