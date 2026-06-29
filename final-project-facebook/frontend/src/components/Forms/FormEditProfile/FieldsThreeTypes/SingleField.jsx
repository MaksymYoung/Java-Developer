import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  EditTextInput,
  InputEdit,
  InputEditMask,
  InputSelect,
  optionsGender,
} from "../../../Forms/FormEditProfile";

const SingleField = ({ name, placeholder }) => {
  const isEditVisible = useSelector((state) => state.editProfile.isEditVisible);
  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { values } = formikProps;

  const firstLowerName = !values.firstName
    ? "any"
    : values.firstName[0].toLowerCase() + values.firstName.slice(1);

  const lastLowerName = !values.lastName
    ? "name"
    : values.lastName[0].toLowerCase() + values.lastName.slice(1);

  const lastUpperName = !values.lastName
    ? "Name"
    : values.lastName[0].toUpperCase() + values.lastName.slice(1);

  const inputPlaceholder = placeholder
    ? placeholder
    : name === "phoneNumber" || name === "viber"
    ? "+38 (0___) __-__-_-__"
    : name === "linkedin"
    ? `linkedin.com/in/${lastLowerName}-${firstLowerName}`
    : name === "telegram"
    ? `@${lastUpperName}`
    : name[0].toUpperCase() + name.slice(1);

  return !isEditVisible[name] ? (
    <EditTextInput name={name} />
  ) : name === "gender" ? (
    <InputSelect name={name} options={optionsGender} />
  ) : name === "phoneNumber" || name === "viber" ? (
    <InputEditMask name={name} placeholder={inputPlaceholder} />
  ) : (
    <InputEdit name={name} placeholder={inputPlaceholder} />
  );
};

SingleField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default SingleField;
