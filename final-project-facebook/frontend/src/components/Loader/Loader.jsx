import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./Loader.scss";

const Loader = ({ className }) => {
  return <div className={cn("loader", className)}></div>;
};

Loader.propTypes = {
  className: PropTypes.string,
};

export default Loader;
