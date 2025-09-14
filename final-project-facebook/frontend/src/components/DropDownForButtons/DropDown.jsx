import React, { forwardRef } from "react";
import "./DropDown.scss";
import cn from "classnames";
import PropTypes from "prop-types";

const DropDown = forwardRef(({ children, className, ...restProps }, ref) => {
  return (
    <div ref={ref} className={cn("drop-down", className)} {...restProps}>
      {children}
    </div>
  );
});

DropDown.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  restProps: PropTypes.object,
};

export default DropDown;
