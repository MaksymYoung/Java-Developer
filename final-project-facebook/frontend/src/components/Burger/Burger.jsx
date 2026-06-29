import React from "react";
import ShowMore from "../../icons/more.svg?react";
import PropTypes from "prop-types";
import cn from "classnames"
import "./Burger.scss";

const Burger = ({ children, className, onClick }) => {

    return (
        <>
            <div className={cn("burger-wrapper", className)} onClick={onClick}>
                <ShowMore className="burger-show-more" />
            </div>
            {children}
        </>
    )
}

Burger.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
}

export default Burger;