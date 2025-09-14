import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./style.scss";
import { ViewContext } from "../../contexts/ViewContext.jsx";
export const ModalBox = ({children, className}) => {    
    const { isLightTheme } = useContext(ViewContext);

    return (
        <div className={cn("modal__box", className, {"light-theme": isLightTheme})}>
            {children}
        </div>
    )
};

ModalBox.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
};

export default ModalBox;
