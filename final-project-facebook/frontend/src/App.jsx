import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./compositions/Header/Header.jsx";
import "./App.scss";
import RootRouter from "./router/index.jsx";
import { ViewProvider } from "./contexts/ViewContext.jsx";
import { verifyToken } from "./helpers/tokenVerificationHelper.js";
import { WebSocketProvider } from "./contexts/WebSocketContext.jsx";



function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    verifyToken(dispatch, navigate, setIsCheckingToken, location.pathname);
  }, [dispatch, navigate, location.pathname]);

  if (isCheckingToken) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <ViewProvider>
        <WebSocketProvider>
        <div className="page-wrapper">
          {location.pathname !== "/login" &&
            location.pathname !== "/login/forgot-password" &&
            location.pathname !== "/login/reset-password" && <Header />}
          <div className="main-content">
            <RootRouter />
          </div>
        </div>
        </WebSocketProvider>
      </ViewProvider>
    </>
  );
}

export default App;
