import React, { useContext, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import Input from "../InputBase/InputBase.jsx";
import Button from "../../Buttons/Button/Button.jsx";
import EyeClosed from "../../../icons/eyes_password/Eye-closed.svg?react";
import EyeOpen from "../../../icons/eyes_password/Eye-open.svg?react";
import "./FormResetPassword.scss";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordUser, clearRegistrationError } from "../../../store/slices/userSlice.js";
import * as Yup from "yup";
import { ViewContext } from "../../../contexts/ViewContext.jsx";

const FormResetPassword = () => {
    const dispatch = useDispatch();
    const registrationError = useSelector((state) => state.user.registrationError);
    const passwordConfirmSuccess = useSelector((state) => state.user.passwordConfirmSuccess);
    const [showPassword, setShowPassword] = useState(false);
    const { isLightTheme } = useContext(ViewContext);

    const setResetPasswordToken = (setFieldValue) => {
        const resetPasswordToken = localStorage.getItem("resetPasswordToken");
        if (resetPasswordToken) {
            setFieldValue("resetPasswordToken", resetPasswordToken);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        // console.log("Form values:", values);
        try {
            const resultAction = await dispatch(resetPasswordUser(values));
            if (resetPasswordUser.fulfilled.match(resultAction)) {
                dispatch(clearRegistrationError());
                localStorage.removeItem("resetPasswordToken");
            } else {
                console.error("Reset password failed:", resultAction.payload);
            }
        } catch (error) {
            console.error("Reset password failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = (resetForm) => {
        dispatch(clearRegistrationError());
        resetForm();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const passwordRegExp = /^(?!\s)(?!.*\s$)(?!.*\s\s)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+$/;

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .matches(passwordRegExp, "Password must be without extra spaces.")
            .min(6, "Too Short! Use 6 or more characters.")
            .max(11, "Too Long! Use up to 11 characters.")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Required')
    });

    return (
        <div className={`form-reset-password__container ${isLightTheme ? "light-theme" : ""}`}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ newPassword: "", confirmPassword: "", resetPasswordToken: "" }}
                onSubmit={handleSubmit}>
                {({ resetForm, setFieldValue }) => {
                    useEffect(() => {
                        setResetPasswordToken(setFieldValue);
                    }, [setFieldValue]);
                    return (
                        <Form className={`form-reset-password__content ${isLightTheme ? "light-theme" : ""}`}>
                            <fieldset className="form-reset-password__form">
                                <legend className={`form-reset-password__title ${isLightTheme ? "light-theme" : ""}`}>Create a new password and confirm it.</legend>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Create a new password"
                                    autoComplete="off"
                                    icon={
                                        <div onClick={togglePasswordVisibility}>
                                            {showPassword ? <EyeOpen /> : <EyeClosed />}
                                        </div>
                                    }
                                />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Repeat the password"
                                    autoComplete="off"
                                    icon={
                                        <div onClick={togglePasswordVisibility}>
                                            {showPassword ? <EyeOpen /> : <EyeClosed />}
                                        </div>
                                    }
                                />
                                {registrationError && (
                                    <div>
                                        <p className="form-registration__error">{registrationError}</p>
                                    </div>
                                )}
                                {passwordConfirmSuccess && (
                                    <div>
                                        <p className="form-registration__success">{passwordConfirmSuccess}</p>
                                    </div>
                                )}
                                <Link
                                    to="/login"
                                    className={`form-reset-password__return-login-link ${isLightTheme ? "light-theme" : ""}`}
                                >&rarr; Sign in.
                                </Link>
                                <div className="form-reset-password__button-container">
                                    <Button
                                        type="reset"
                                        className={`form-reset-password__button fb-gray ${isLightTheme ? "light-theme" : ""}`}
                                        onClick={() => handleReset(resetForm)}
                                    >Clear
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="form-reset-password__button"
                                    >Accept
                                    </Button>
                                </div>
                            </fieldset>
                        </Form>
                    );
                }}
            </Formik>

        </div>
    )
};

export default FormResetPassword;
