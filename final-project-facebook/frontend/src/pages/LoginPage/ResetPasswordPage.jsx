import React, { useContext } from "react";
import cn from "classnames";
import FormResetPassword from "../../components/Forms/FormResetPassword/FormResetPassword.jsx";
import { ViewContext } from "../../contexts/ViewContext.jsx";
import "./ResetPasswordPage.scss";
import "./AuthPagesContainer.scss";

const ResetPasswordPage = () => {
    const { isLightTheme } = useContext(ViewContext);

    return (
        <div className={cn("auth-pages-container reset-password-page__container", {"light-theme": isLightTheme})}>
            <div className={cn("reset-password-page__content", {"light-theme": isLightTheme})}>
                <h1 className={cn("reset-password-page__title", {"light-theme": isLightTheme})}>
                    Update your account password in  
                    <span className={cn("reset-password-page__title--logo", {"light-theme": isLightTheme})}> 
                        &nbsp;Facebook
                    </span>
                </h1>
                <FormResetPassword />
            </div>
        </div>
    )
};

export default ResetPasswordPage;
