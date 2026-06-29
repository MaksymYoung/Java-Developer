import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import ButtonBase from "../";

const ButtonPlate = ({ className, onClick, children }) => {
  return (
    <ButtonBase className={cn("btn-plate", className)} onClick={onClick}>
      {children}
    </ButtonBase>
  );
};

ButtonPlate.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

export default ButtonPlate;
