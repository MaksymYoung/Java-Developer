import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance.js";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../helpers/checkToken.js";
import { jwtDecode } from "jwt-decode";
import Loader from "../components/Loader/Loader.jsx";
import { useDispatch } from "react-redux";
import { setTokens, setUserId } from "../store/slices/userSlice.js";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          try {
            const response = await axiosInstance.post("/api/v1/jwt/refresh", { refreshToken });
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            dispatch(setTokens({ accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }));

            const decodedToken = jwtDecode(response.data.accessToken);
            dispatch(setUserId(decodedToken.userId));

            setLoading(false);
          } catch (err) {
            window.location.href = "/login";
          }
        } else {
          window.location.href = "/login";
        }
      } else {
        const decodedToken = jwtDecode(accessToken);
        dispatch(setUserId(decodedToken.userId));
        // }
        setLoading(false);
      }
    };
    checkToken();
  }, [accessToken, refreshToken, dispatch]);

  if (loading) return <Loader />;

  return accessToken && refreshToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
