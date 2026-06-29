import React from "react";
import "./DropDownItem.scss";
import cn from "classnames";
import PropTypes from "prop-types";

const DropDownItem = ({ name, icon, onClick, className, children, childrenName }) => {
  return (
    <div className={cn("dropdown-btn", className)} onClick={onClick}>
      <div className="dropdown-btn__container">
        <span className="dropdown-btn__icon">{icon}</span>
        <span className="dropdown-btn__name">{name}{childrenName}</span>
      </div>
      {children}
    </div>
  );
};

DropDownItem.propTypes = {
  icon: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
};

export default DropDownItem;
