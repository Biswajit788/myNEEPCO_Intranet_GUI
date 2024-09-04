import { jwtDecode } from "jwt-decode";

export function isTokenExpired() {
  const token = localStorage.getItem('token');

  if (!token) return true; // No token means expired or invalid

  try {
    const decodedToken = jwtDecode(token); // Correct default import
    const expiry = decodedToken.exp; // Expiry time in seconds
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now > expiry; // Check if current time is past expiry
  } catch (error) {
    return true; // Error decoding token means expired or invalid
  }
}
