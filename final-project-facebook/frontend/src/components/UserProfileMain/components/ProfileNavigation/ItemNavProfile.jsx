import React from "react";
import { NavLink } from "react-router-dom";
import cn from "classnames";
import PropTypes from "prop-types";

const ItemNavProfile = ({ children, className, name }) => {
  return (
    <li className={cn("user-nav-item", name)}>
      <NavLink className={cn("user-nav-link", className)} to={name}>
        {children}
      </NavLink>
    </li>
  );
};

ItemNavProfile.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.any,
  className: PropTypes.string,
};

export default ItemNavProfile;
