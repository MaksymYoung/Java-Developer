import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./Button.scss";

const Button = (props) => {
  const { className, type = "button", onClick, children, disabled, ...restProps } = props;

  return (
    <button
      className={cn("fb-button", className)}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  restProps: PropTypes.object,
};

export default Button;
