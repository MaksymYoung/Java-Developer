import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";
import cn from "classnames";

import "./InputType.scss";

const InputEdit = (props) => {
  const { name, className, placeholder } = props;

  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { errors, touched } = formikProps;
  const hasError = errors[name] && touched[name];

  return (
    <label className={cn("label__order", className)}>
      <Field
        name={name}
        className={cn("input__order", {
          "error-input": hasError,
        })}
        type="text"
        placeholder={placeholder}
      />
      <ErrorMessage name={name} className={"error-message"} component={"p"} />
    </label>
  );
};

InputEdit.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default InputEdit;
