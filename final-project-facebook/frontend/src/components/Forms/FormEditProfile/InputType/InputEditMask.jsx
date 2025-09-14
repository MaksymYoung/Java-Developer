import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { ErrorMessage, useField } from "formik";
import cn from "classnames";

import { InputMask } from "@react-input/mask";

import "./InputType.scss";

const InputEditMask = (props) => {
  const {
    name,
    className,
    placeholder,
    type = "text",
    mask = "+__ (___) __-__-___",
    replacement = { _: /\d/ },
    ...restProps
  } = props;

  const formikProps = useSelector((state) => state.editProfile.formikProps);
  if (!formikProps) {
    return null;
  }
  const { errors, touched } = formikProps;
  const hasError = errors[name] && touched[name];
  const [field] = useField(name);

  return (
    <label className={cn("label__order", className)}>
      <InputMask
        name={name}
        className={cn("input__order", {
          "error-input": hasError,
        })}
        value={field.value || ""}
        mask={mask}
        replacement={replacement}
        type={type}
        placeholder={placeholder}
        {...field}
        {...restProps}
      />
      <ErrorMessage name={name} className={"error-message"} component={"p"} />
    </label>
  );
};

InputEditMask.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  mask: PropTypes.string,
  replacement: PropTypes.object,
  restProps: PropTypes.object,
};

export default InputEditMask;
