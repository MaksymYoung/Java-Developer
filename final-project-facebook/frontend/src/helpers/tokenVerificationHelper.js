// Функція перевірки токенів при завантажені сайту
import { checkTokenValidity, actionLogOutUser } from "../store/slices/userSlice";

export const verifyToken = async (dispatch, navigate, setIsCheckingToken, currentPath) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const publicPaths = ["/login", "/login/forgot-password", "/login/reset-password"];

  if (!accessToken || !refreshToken) {
    if (!publicPaths.includes(currentPath)) {
      dispatch(actionLogOutUser());
      navigate("/login");
    }
    setIsCheckingToken(false);
    return;
  }

  try {
    await dispatch(checkTokenValidity()).unwrap();
  } catch (error) {
    console.error("Token validation failed, logging out and redirecting...", error);
    dispatch(actionLogOutUser());
    navigate("/login");
  } finally {
    setIsCheckingToken(false);
  }
};