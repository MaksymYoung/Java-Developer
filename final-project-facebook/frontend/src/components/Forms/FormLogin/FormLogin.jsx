import React, { useState, useRef, useContext, useEffect } from "react";
import { Form, Formik } from "formik";
import { useNavigate, Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import Input from "../InputBase/InputBase.jsx";
import EyeClosed from "../../../icons/eyes_password/Eye-closed.svg?react";
import EyeOpen from "../../../icons/eyes_password/Eye-open.svg?react";
import Button from "../../Buttons/Button/Button.jsx";
// import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import "./FormLogin.scss";
import { useDispatch, useSelector } from "react-redux";
import { actionToggleFormRegistrationModal, loginUser, clearRegistrationError, clearSuccessMessage } from "../../../store/slices/userSlice.js";
// import { actionGetAvatar } from "../../../store/slices/avatarSlice.js";
import * as Yup from "yup";
import { ViewContext } from "../../../contexts/ViewContext.jsx";

const FormLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const registrationError = useSelector((state) => state.user.registrationError);
    const registrationSuccessMessage = useSelector((state) => state.user.registrationSuccessMessage);
    const [showPassword, setShowPassword] = useState(false);
    const { isLightTheme } = useContext(ViewContext);

    const resetFormRef = useRef(null);

    useEffect(() => {
        dispatch(clearRegistrationError());
    }, [dispatch]);

    const handleFormRegistrationModal = () => {
        if (resetFormRef.current) {
            resetFormRef.current();
        }
        dispatch(actionToggleFormRegistrationModal())
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const trimmedValues = {
            ...values,
            email: values.email.trim().toLowerCase(),
        };

        // console.log("Form values:", values);
        try {
            const resultAction = await dispatch(loginUser(trimmedValues));
            if (loginUser.fulfilled.match(resultAction)) {
                dispatch(clearRegistrationError());
                dispatch(clearSuccessMessage());

                // const userId = jwtDecode(resultAction.payload.accessToken).userId;
                // console.log("userId", userId);

                // // Використання дефолтної аватарки
                // const avatarData = new FormData();
                // const response = await fetch(PhotoAvaDefault);
                // const blob = await response.blob();
                // avatarData.append("file", blob, "default-avatar.jpg");
                // // Відправляємо дефотну аватарку на сервер
                // await dispatch(actionGetAvatar({ formData: avatarData, userId, imageName: "default-avatar.jpg" }));

                navigate("/home");
            } else {
                console.error("Login failed:", resultAction.payload);
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
    const passwordRegExp = /^(?!\s)(?!.*\s$)(?!.*\s\s)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+$/;

    const validationSchema = Yup.object({
        email: Yup.string()
            .matches(emailRegExp, "Invalid email address")
            .required("Required"),
        password: Yup.string()
            .matches(passwordRegExp, "Password must be without extra spaces.")
            .min(6, "Too Short! Use 6 or more characters.")
            .max(11, "Too Long! Use up to 11 characters.")
            .required("Required"),
    });

    return (
        <div className={`form-login__container ${isLightTheme ? "light-theme" : ""}`}>
            {registrationSuccessMessage && (
                <div className="form-login__success-registration">
                    <p>{registrationSuccessMessage}</p>
                </div>
            )}
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={handleSubmit}>
                {({ resetForm }) => (
                    resetFormRef.current = resetForm,
                    <Form className={`form-login__content ${isLightTheme ? "light-theme" : ""}`}>
                        <fieldset className="form-login__form">
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                // autoComplete="username"
                                autoComplete="off"
                                showErrorOnTouch={false}  // Вимикаємо помилку при доторканні, тут вона недоречна
                            />
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                // autoComplete="current-password"
                                autoComplete="off"
                                showErrorOnTouch={false}  // Вимикаємо помилку при доторканні, тут вона недоречна
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
                            <Button
                                type="submit"
                                className="form-login__button"
                            >Sign in
                            </Button>
                            <Link
                                to="/login/forgot-password"
                                className={`form-login__reset-password-link ${isLightTheme ? "light-theme" : ""}`}
                            >&rarr; Forgot your password?
                            </Link>
                        </fieldset>
                    </Form>
                )}
            </Formik>
            <Button className="form-login__button fb-green"
                type="button"
                onClick={handleFormRegistrationModal}
            >Sign up
            </Button>
        </div>
    )
};

export default FormLogin;
