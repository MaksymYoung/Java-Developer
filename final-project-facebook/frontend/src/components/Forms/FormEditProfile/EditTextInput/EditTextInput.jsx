import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import cn from "classnames";

import "./EditTextInput.scss";

import { optionsMonths } from "../../../../components/Forms/FormEditProfile";

const EditTextInput = ({ name, fieldNameFirst, fieldNameSecond }) => {
  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { values, errors, touched } = formikProps;

  const hasError =
    fieldNameFirst && fieldNameSecond
      ? (errors[fieldNameFirst] && touched[fieldNameFirst]) ||
        (errors[fieldNameSecond] && touched[fieldNameSecond])
      : errors[name] && touched[name];

  const getMonthName = (monthValue) => {
    const monthName = optionsMonths.find(
      (option) => option.value === monthValue
    );
    return monthName ? monthName.label : monthValue;
  };

  const birthComposition =
    !values["month"] || !values["day"] || !values["year"]
      ? "Loading..."
      : `${getMonthName(values["month"])} ${values["day"]}, ${values["year"]}`;

  const nameComposition = `${values[fieldNameFirst] ?? "Loading..."} ${
    values[fieldNameSecond] ?? ""
  }`;

  const primaryText =
    name === "birthday"
      ? birthComposition
      : name === "gender"
      ? values.gender === "string" || values.gender === ""
        ? ""
        : values.gender
        ? values.gender[0].toUpperCase() + values.gender.slice(1)
        : "Loading..."
      : fieldNameFirst && fieldNameSecond
      ? nameComposition
      : values[name] ?? "Loading...";

  const secondaryText =
    name === "phoneNumber"
      ? "Phone Number"
      : name === "birthday"
      ? "Date of Birth"
      : name === "fullname"
      ? "Full Name"
      : name === "linkedin"
      ? "linked-In"
      : name[0].toUpperCase() + name.slice(1);

  return (
    <div className="input-edit__text-wrapper">
      <p className={cn("input-edit__text-primary", { error: hasError })}>
        {primaryText}
      </p>
      <p className={cn("input-edit__text-secondary", { error: hasError })}>
        {secondaryText}
      </p>
    </div>
  );
};

EditTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  fieldNameFirst: PropTypes.string,
  fieldNameSecond: PropTypes.string,
};

export default EditTextInput;
