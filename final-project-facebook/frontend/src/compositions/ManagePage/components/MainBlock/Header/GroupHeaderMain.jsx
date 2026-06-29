import cn from "classnames";
import React from "react";
import Button from "../../../../../components/Buttons/Button/Button";
import UserIcon from "../../../../../icons/user-big.svg?react";
import "./GroupHeaderMain.scss";


const GroupHeaderMain = (props) => {
    const { className, name, groupType, members, onLock, ...restProps } = props;
    return (
        <>
            <div className={cn("group-header", className)}>
                <div className="group-short-info-main">
                    <div className="name">
                        {name}
                    </div>
                    <div className="info-block">
                        {onLock()}
                        <div className="status">
                            {groupType}
                        </div>
                        <div className="members">
                            Number of members {members}
                        </div>
                    </div>
                    <div className="group-user-icon">
                        <UserIcon className="user-icon"></UserIcon>
                        <div className="group-main-block-btn-wrapper">
                            <Button className="group-img-btn group-main-block">
                                <p className="btn-text">+ Invite</p>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupHeaderMain;
