import React, { createContext, useState } from "react";

// Створення контексту
const ViewContext = createContext();

// Провайдер для контексту
const ViewProvider = ({ children }) => {
    const [isLightTheme, setIsLightTheme] = useState(false);

    const toggleTheme = () => {
        setIsLightTheme(prevTheme => !prevTheme);
    };

    return (
        <ViewContext.Provider value={{ isLightTheme, toggleTheme }}>
            {children}
        </ViewContext.Provider>
    );
};

export { ViewContext, ViewProvider };
