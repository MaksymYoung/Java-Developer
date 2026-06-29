import React, { useContext, useEffect } from "react";
import { Form, Formik } from "formik";
import Input from "../InputBase/InputBase.jsx";
import Button from "../../Buttons/Button/Button.jsx";
import "./FormForgotPassword.scss";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordUser, clearRegistrationError, clearSuccessMessage } from "../../../store/slices/userSlice.js";
import * as Yup from "yup";
import { ViewContext } from "../../../contexts/ViewContext.jsx";

const FormForgotPassword = () => {
    const dispatch = useDispatch();
    const registrationError = useSelector((state) => state.user.registrationError);
    const passwordResetSuccess = useSelector((state) => state.user.passwordResetSuccess);
    const { isLightTheme } = useContext(ViewContext);

    useEffect(() => {
        dispatch(clearRegistrationError());
        dispatch(clearSuccessMessage());
    }, [dispatch]);

    const handleSubmit = async (values, { setSubmitting }) => {
        const trimmedValues = {
            ...values,
            email: values.email.trim().toLowerCase(),
        };

        // console.log("Form values:", values);
        try {
            const resultAction = await dispatch(forgotPasswordUser(trimmedValues));
            if (forgotPasswordUser.fulfilled.match(resultAction)) {
                dispatch(clearRegistrationError());
            } else {
                console.error("forgotPasswordUser failed:", resultAction.payload);
            }
        } catch (error) {
            console.error("forgotPasswordUser failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        dispatch(clearRegistrationError());
    };

    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

    const validationSchema = Yup.object({
        email: Yup.string()
            .matches(emailRegExp, "Invalid email address")
            .required("Required"),
    });

    return (
        <div className={`form-forgot-password__container ${isLightTheme ? "light-theme" : ""}`}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "" }}
                onSubmit={handleSubmit}>
                {() => (
                    <Form className={`form-forgot-password__content ${isLightTheme ? "light-theme" : ""}`}>
                        <fieldset className="form-forgot-password__form">
                            <legend className={`form-forgot-password__title ${isLightTheme ? "light-theme" : ""}`}>Please enter your email to search for your account.</legend>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                autoComplete="off"
                            />
                            {registrationError && (
                                <div>
                                    <p className="form-registration__error">{registrationError}</p>
                                </div>
                            )}
                            {passwordResetSuccess && (
                                <div>
                                    <p className="form-registration__success">{passwordResetSuccess}</p>
                                </div>
                            )}
                            <div className="form-forgot-password__button-container">
                                <Button
                                    type="reset"
                                    className={`form-forgot-password__button fb-gray ${isLightTheme ? "light-theme" : ""}`}
                                    onClick={() => handleReset()}
                                >Clear
                                </Button>
                                <Button
                                    type="submit"
                                    className="form-forgot-password__button"
                                >Search
                                </Button>
                            </div>
                        </fieldset>
                    </Form>
                )}
            </Formik>

        </div>
    )
};

export default FormForgotPassword;
