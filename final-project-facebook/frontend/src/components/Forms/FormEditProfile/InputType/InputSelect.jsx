import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";
import cn from "classnames";

import "./InputType.scss";

const InputSelect = (props) => {
  const { name, className, options } = props;

  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { errors, touched } = formikProps;
  const hasError = errors[name] && touched[name];

  return (
    <label className={cn("label__order", className)}>
      <Field
        as="select"
        name={name}
        className={cn("input__select", {
          "error-input": hasError,
        })}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} label={option.label} />
        ))}
      </Field>

      <ErrorMessage name={name} className={"error-message"} component={"p"} />
    </label>
  );
};

InputSelect.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default InputSelect;
