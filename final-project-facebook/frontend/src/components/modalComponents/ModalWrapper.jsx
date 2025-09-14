import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./style.scss";
import { ViewContext } from "../../contexts/ViewContext.jsx";

const ModalWrapper = ({ children, onClick, className }) => {
    const { isLightTheme } = useContext(ViewContext);
    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget && onClick) {
            onClick();
        }
    };

    return (
        <div className={cn("modal__wrapper", className, {"light-theme": isLightTheme})} onMouseDown={handleMouseDown}>
            {children}
        </div>
    );
};

ModalWrapper.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func
};

export default ModalWrapper;
