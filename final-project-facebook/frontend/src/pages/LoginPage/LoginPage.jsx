import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import FormLogin from "../../components/Forms/FormLogin/FormLogin.jsx";
import FormRegistrationModal from "../../components/Forms/FormRegistrationModal/FormRegistrationModal.jsx";
import { ViewContext } from "../../contexts/ViewContext.jsx";
import { actionToggleFormRegistrationModal } from "../../store/slices/userSlice.js";
import "./LoginPage.scss";
import "./AuthPagesContainer.scss";

const LoginPage = () => {
    const { isLightTheme, toggleTheme } = useContext(ViewContext);
    const dispatch = useDispatch();
    const isFormRegistrationModal = useSelector((state) => state.user.isFormRegistrationModal);

    return (
        <div className={cn("auth-pages-container login-page__container", {"light-theme": isLightTheme})}>
            <div className={cn("login-page__content", {"light-theme": isLightTheme})}>
                <div className="login-page__title">
                    <h1 className={cn("login-page__title--text", {"light-theme": isLightTheme})}>
                        Welcome to 
                        <span className={cn("login-page__title--logo", {"light-theme": isLightTheme})}>&nbsp;Facebook</span>
                    </h1>                     
                    <h2 className={cn("login-page__title--greeting", {"light-theme": isLightTheme})}>
                        Keep in touch with family and friends...
                    </h2>
                </div>
                <FormLogin />
                {isFormRegistrationModal && (
                    <FormRegistrationModal
                        close={() => dispatch(actionToggleFormRegistrationModal())}
                    />
                )}
                {/* <button onClick={toggleTheme} className="theme-toggle-button">
                    {isLightTheme ? "Switch to Dark Theme" : "Switch to Light Theme"}
                </button> */}
            </div>
        </div>

    )
};

export default LoginPage;
