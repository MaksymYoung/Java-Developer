import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import cn from "classnames";

import * as Icons from "../../../../icons/editProfile";

import "./IconWrapper.scss";

const IconWrapper = ({ name }) => {
  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { values } = formikProps;

  const transformIconName = name[0].toUpperCase() + name.slice(1) + "Icon";

  const iconName =
    name === "gender" &&
    values.gender !== "male" &&
    values.gender !== "female" &&
    values.gender !== "they"
      ? "QuestionIcon"
      : name === "gender" && values.gender === "male"
      ? "MaleIcon"
      : name === "gender" && values.gender === "female"
      ? "FemaleIcon"
      : name === "gender" && values.gender === "they"
      ? "TheyIcon"
      : transformIconName;

  const IconComponent = Icons[iconName];

  if (!IconComponent) {
    console.error(`Icon for name "${name}" not found.`);
    return null;
  }

  return (
    <div className={cn("icon-edit__wrapper")}>
      <IconComponent className={cn("icon-edit__element", name)} />
    </div>
  );
};

IconWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default IconWrapper;
