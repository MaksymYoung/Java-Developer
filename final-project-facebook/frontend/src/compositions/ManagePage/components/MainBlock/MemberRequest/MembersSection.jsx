import cn from "classnames";
import React from "react";
import "./MemberRequestSection.scss";

const MembersSection = (props) => {
    const { className, children, ...restProps } = props;
    return (
        <div className={cn("request-members", className)}>
                {children}
        </div>
    )
}

export default MembersSection