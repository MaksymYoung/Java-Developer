import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import "./PageWrapper.scss";

const PageWrapper = (props) => {
    const { className, children, ...restProps } = props;
    return (
        <>
            <div className={cn("block-wrapper")} {...restProps}>
                {children}
            </div>
        </>
    );
};

PageWrapper.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    restProps: PropTypes.object,
  }
  
export default PageWrapper;

