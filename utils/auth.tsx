import {jwtDecode} from "jwt-decode";

export function isTokenExpired() {
  const token = localStorage.getItem('token');

  if (!token) return true; // No token means expired or invalid

  try {
    const decodedToken: { exp?: number } = jwtDecode(token); // Decode token with optional exp property
    const expiry = decodedToken.exp; // Expiry time in seconds

    if (expiry === undefined) {
      // If expiry is undefined, handle it (e.g., treat token as expired or invalid)
      console.warn('Token does not have an exp field');
      return true;
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now > expiry; // Check if current time is past expiry
  } catch (error) {
    // Error decoding token means expired or invalid
    console.error('Error decoding token:', error);
    return true;
  }
}
