import cn from "classnames";
import React from "react";
import "./MemberRequestSection.scss";

const MemberRequestHeader = (props) => {
    const { className, children, ...restProps } = props;
    return (
        <div className={cn("request-header-text", className)}>
                {children}
        </div>
    )
}

export default MemberRequestHeader