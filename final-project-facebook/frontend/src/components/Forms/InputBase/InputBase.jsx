import React, { useContext } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Field, ErrorMessage, useField, useFormikContext } from "formik";
import PhoneInput from "react-phone-input-2";
import "./InputBase.scss";
import { ViewContext } from "../../../contexts/ViewContext.jsx";

const Input = (props) => {
    const {
        labelClassName,
        labelTextClassName,
        inputContainerClassName,
        fieldClassName,
        errorClassName,
        type = "text",
        placeholder,
        name,
        label,
        error,
        options,
        icon,
        showErrorOnTouch = true,
        ...restProps
    } = props;

    const { submitCount } = useFormikContext(); // Отримуємо submitCount з контексту Formik
    const [field, meta] = useField(name);
    const isError = (submitCount > 0 || (showErrorOnTouch && meta.touched)) && meta.error;
    const { isLightTheme } = useContext(ViewContext);
    return (
        <>
            <label className={cn("input__label-container", labelClassName)}>
                <p className={cn("input__label-text", labelTextClassName)}>{label}</p>
                <div className={cn("input__item-container", inputContainerClassName)}>
                    {icon && <div className="input__icon">{icon}</div>}
                    {type === "select" ? (
                        <Field
                            as="select"
                            className={
                                cn("input__item select-placeholder",
                                    fieldClassName,
                                    { "input__has-validation": isError },
                                    { "light-theme": isLightTheme })
                            }
                            name={name}
                            {...field} // Тут додаються html-атрибути тега input (name, value, onChange, onBlur, placeholder тощо).
                            {...restProps} // Тут додаються всі інші пропси (наприклад data-testid, aria-label).
                        >
                            <option value="" disabled>
                                {placeholder}
                            </option>
                            {options &&
                                options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                        </Field>
                    ) : type === "tel" ? (
                        <Field
                            name={name}>
                            {({ field, form }) => (
                                <PhoneInput
                                    {...field} // Додає атрибути name, value, onChange, onBlur
                                    country={"ua"}
                                    placeholder={placeholder}
                                    containerClass={cn("phone-input", fieldClassName)} // Стилі для контейнера телефонного інпуту
                                    inputClass={
                                        cn("form-control", "input__item",
                                            { "input__has-validation": isError },
                                            { "light-theme": isLightTheme })
                                    }// Стилі для самого інпуту
                                    onChange={(value) => form.setFieldValue(name, value)} // Оновлює значення поля в Formik
                                    onBlur={() => form.setFieldTouched(name, true)} // Оновлює стан поля в Formik при втраті фокусу
                                    {...restProps} // Додає інші кастомні пропси, які можуть бути передані
                                />
                            )}
                        </Field>
                    ) : (
                        <Field
                            type={type}
                            className={cn("input__item",
                                fieldClassName,
                                { "input__has-validation": isError },
                                { "light-theme": isLightTheme })
                            }
                            name={name}
                            placeholder={placeholder}
                            {...field}
                            {...restProps}
                        />
                    )}
                </div>
                {isError && (
                    <p className={cn("input__error-message", errorClassName)}>{meta.error}</p>
                )}
            </label>
        </>
    );
};

Input.propTypes = {
    labelClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    errorClassName: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ),
    restProps: PropTypes.object,
};

export default Input;
