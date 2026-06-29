import React from "react";
import "./TitleAside.scss";
import cn from "classnames";
import PropTypes from "prop-types";

const TitleAside = ({ children, className }) => {
  return <h1 className={cn("title-aside", className)}>{children}</h1>;
};

TitleAside.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default TitleAside;
