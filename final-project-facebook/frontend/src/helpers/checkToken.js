import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Час в секундах
  return decodedToken.exp < currentTime;
}
