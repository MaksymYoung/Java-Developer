import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const ButtonBase = (props) => {
  const { className, type = "button", onClick, children, ...restProps } = props;

  return (
    <button
      className={cn(className)}
      type={type}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

ButtonBase.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  restProps: PropTypes.object,
};

export default ButtonBase;
