import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import "./MainBlock.scss";

const MainBlock = (props) => {
    const { className, children, ...restProps } = props;
    return (
        <>
            <div className={cn("main-block", className)} {...restProps}>
                {children}
            </div>
        </>
    );
};

MainBlock.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    restProps: PropTypes.object,
  }
export default MainBlock;