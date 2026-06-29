import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./ButtonPlateRectangle.scss";

import ButtonPlate from "../ButtonPlate";

const ButtonPlateRectangle = ({ children, className }) => {
  return (
    <ButtonPlate className={cn("rectangle", className)}>{children}</ButtonPlate>
  );
};

ButtonPlateRectangle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

export default ButtonPlateRectangle;
