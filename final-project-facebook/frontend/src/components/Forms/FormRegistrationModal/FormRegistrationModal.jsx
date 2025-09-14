import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import cn from "classnames";
import ModalWrapper from "../../modalComponents/ModalWrapper.jsx";
import ModalBox from "../../modalComponents/ModalBox.jsx";
import ModalClose from "../../modalComponents/ModalClose.jsx";
import { Form, Formik } from "formik";
import Input from "../InputBase/InputBase.jsx";
import Button from "../../Buttons/Button/Button.jsx";
import EyeClosed from "../../../icons/eyes_password/Eye-closed.svg?react";
import EyeOpen from "../../../icons/eyes_password/Eye-open.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearRegistrationError, setRegistrationSuccessMessage } from "../../../store/slices/userSlice.js";
import * as Yup from "yup";
import "./FormRegistrationModal.scss";
import { ViewContext } from "../../../contexts/ViewContext.jsx";

const FormRegistrationModal = ({ close }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registrationError = useSelector((state) => state.user.registrationError);
  const [showPassword, setShowPassword] = useState(false);
  const { isLightTheme } = useContext(ViewContext);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const trimmedValues = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
    };

    // console.log("Form values:", values);
    try {
      const resultAction = await dispatch(registerUser(trimmedValues));
      if (registerUser.fulfilled.match(resultAction)) {
        dispatch(clearRegistrationError()); 
        dispatch(setRegistrationSuccessMessage("You have successfully registered. Please sign in with your new account."));
        close();
        navigate("/login");
      } else {
        console.error("Registration failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkClick = () => {
    close();
    dispatch(clearRegistrationError());
    navigate("/login");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nameRegExp =
    /^(?!\s)(?!.*\s\s)[a-zA-Z0-9\s\-']+$/;
  const passwordRegExp =
    /^(?!\s)(?!.*\s$)(?!.*\s\s)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+$/;
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  const phoneRegExp =
    /^(\+?\d{1,4}[\s-]?)?((\(\d{1,5}\))|\d{1,5})[\s-]?\d{1,5}([\s-]?\d{1,5}){1,2}$/;

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(
        nameRegExp,
        "Use letters,numbers,without extra spaces."
      )
      .min(2, "Too Short! Use more than 1 characters.")
      .max(16, "Too Long! Use less than 16 characters.")
      .required("Required"),
    lastName: Yup.string()
      .matches(
        nameRegExp,
        "Use letters,numbers,without extra spaces."
      )
      .min(2, "Too Short! Use more than 1 characters.")
      .max(16, "Too Long! Use less than 16 characters.")
      .required("Required"),
    email: Yup.string()
      .matches(emailRegExp, "Invalid email address")
      .required("Required"),
    password: Yup.string()
      .matches(
        passwordRegExp,
        "Password must be without extra spaces."
      )
      .min(6, "Too Short! Use 6 or more characters.")
      .max(16, "Too Long! Use up to 16 characters.")
      .required("Required"),
    phoneNumber: Yup.string().matches(phoneRegExp, "Invalid phone number"),
    birthDate: Yup.string().required("Required"),
  });

  return (
    <ModalWrapper>
      <ModalBox className="form-registration__box">
        <ModalClose onClick={() => {
          close();
          dispatch(clearRegistrationError());
        }}
        />
        <p className={cn("form-registration__title", { "light-theme": isLightTheme })}>Join
          <span className="form-registration__text--logo"> Facebook</span>
        </p>
        <p className={cn("form-registration__title-text", { "light-theme": isLightTheme })}>is quick and easy</p>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: "",
            birthDate: "",
            gender: "",
          }}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <fieldset className="form-registration__content">
                <Input
                  type="text"
                  name="firstName"
                  labelClassName="input__item-grid"
                  placeholder="First name *"
                  error={errors.name && touched.name}
                />
                <Input
                  type="text"
                  name="lastName"
                  labelClassName="input__item-grid"
                  placeholder="Last name *"
                  error={errors.name && touched.name}
                />
                <Input
                  type="email"
                  name="email"
                  labelClassName="input__item-grid"
                  placeholder="Enter email, it'll be your login *"
                  error={errors.name && touched.name}
                  autoComplete="off"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  labelClassName="input__item-grid"
                  placeholder="Сreate a password *"
                  error={errors.name && touched.name}
                  autoComplete="off"
                  icon={
                    <div onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOpen /> : <EyeClosed />}
                    </div>
                  }
                />
                <Input
                  type="tel"
                  name="phoneNumber"
                  labelClassName="input__item-grid"
                  error={errors.name && touched.name}
                  // mask={"+38(099)999-99-99"}
                  mask={["+", "3", "8", " ", "(", "0", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                />
                <Input
                  type="date"
                  name="birthDate"
                  labelClassName="input__item-grid"
                  error={errors.name && touched.name}
                  label="Birthday"
                />
                <Input
                  type="select"
                  name="gender"
                  labelClassName="input__item-grid"
                  placeholder="Choose your gender"
                  options={[
                    { value: "female", label: "female" },
                    { value: "male", label: "male" },
                    { value: "other", label: "other" },
                  ]}
                  error={errors.name && touched.name}
                  label="Gender"
                />
                <Button className="fb-green input__item-grid" type="submit">
                  Sign up
                </Button>
              </fieldset>
            </Form>
          )}
        </Formik>
        {registrationError && (
          <div>
            <p className="form-registration__error">{registrationError}</p>
            <Link to="/login" className="form-registration__error-link" onClick={handleLinkClick}>Login Form</Link>
          </div>
        )}
        <p className="form-registration__footer-text">
          By tapping Sign up, you agree to our Terms, Data Policy and Cookies
          Policy
        </p>
      </ModalBox>
    </ModalWrapper>
  );
};

FormRegistrationModal.propTypes = {
  close: PropTypes.func,
};

export default FormRegistrationModal;
