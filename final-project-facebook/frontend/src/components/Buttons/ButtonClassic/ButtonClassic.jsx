import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./ButtonClassic.scss";

import ButtonBase from "../";

const ButtonClassic = ({ className, type, children, onClick }) => {
  return (
    <ButtonBase className={cn("btn", className)} type={type} onClick={onClick}>
      {children}
    </ButtonBase>
  );
};

ButtonClassic.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonClassic;
