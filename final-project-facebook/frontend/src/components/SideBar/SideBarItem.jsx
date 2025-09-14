import React from "react";
import "./SideBar.scss";
import cn from "classnames";
import PropTypes from "prop-types";

const SideBarItem = (props) => {
  const { icon, name, onClick, className } = props;

  return (
    <div className={cn("sidebar-item", className)} onClick={onClick}>
      <div className="sidebar-item__icon">{icon}</div>
      <p className="sidebar-item__name">{name}</p>
    </div>
  );
};

SideBarItem.propTypes = {
  icon: PropTypes.element,
  name: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default SideBarItem;
