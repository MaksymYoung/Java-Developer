import React, { useContext } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import FormForgotPassword from "../../components/Forms/FormForgotPassword/FormForgotPassword.jsx";
import { ViewContext } from "../../contexts/ViewContext.jsx";
import "./ForgotPasswordPage.scss";
import "./AuthPagesContainer.scss";

const ForgotPasswordPage = () => {
    const { isLightTheme } = useContext(ViewContext);

    return (
        <div className={cn("auth-pages-container forgot-password-page__container", { "light-theme": isLightTheme })}>
            <div className={cn("forgot-password-page__content", { "light-theme": isLightTheme })}>
                <h1 className={cn("forgot-password-page__title", { "light-theme": isLightTheme })}>
                    Find your account in
                    <span className={cn("forgot-password-page__title--logo", { "light-theme": isLightTheme })}>
                        &nbsp;Facebook
                    </span>
                </h1>
                <FormForgotPassword />
                <Link
                    to="/login"
                    className={`forgot-password-page__return-login ${isLightTheme ? "light-theme" : ""}`}
                >&larr; Return to the authorization login
                </Link>
            </div>
        </div>
    )
};

export default ForgotPasswordPage;
