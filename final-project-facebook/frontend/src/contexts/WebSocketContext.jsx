import "../pages/ChatsPage/init.jsx";
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useLocation } from "react-router-dom";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!location.pathname.startsWith("/login")) {
      const socket = new SockJS(`${baseURL}/ws/msg`);
      const stompClient = Stomp.over(socket);
      stompClient.debug = null;
      stompClient.connect(
        { Authorization: `Bearer ${accessToken}` },
        () => {
          setClient(stompClient);
        },
        (error) => {
          console.error("Connection failed", error);
        }
      );

      return () => {
        if (
          ((stompClient && stompClient.connected)) ||
          location.pathname.startsWith("/login")
        ) {
          stompClient.disconnect(() => {});
        }
      };
    }
  }, [accessToken]);
  return (
    <WebSocketContext.Provider value={{ client }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  client: PropTypes.object,
  children: PropTypes.any,
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
