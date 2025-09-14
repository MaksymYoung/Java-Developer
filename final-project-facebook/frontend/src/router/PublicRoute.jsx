import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return !accessToken && !refreshToken ? children : <Navigate to="/home" />;
}

export default PublicRoute;
