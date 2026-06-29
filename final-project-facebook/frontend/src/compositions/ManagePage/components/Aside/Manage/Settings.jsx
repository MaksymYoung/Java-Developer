import cn from "classnames";
import React from "react";
import Gear from "../../../../../icons/gear.svg?react"
import FriendAdd from "../../../../../icons/friendAdd-fill.svg?react"
import "./Settings.scss";

const Settings = (props) => {
    const { className, children, name, groupType, members, onLock, btnSetting, setBtnSetting, ...restProps } = props;
    return (
        <>
            <div className="settings-wrapper">
                <div className={cn(`settings-item-aside ${btnSetting === "member-request" ? 'activeBlue' : ''}`, className)} onClick={() => { setBtnSetting("member-request") }}>
                    <div className={`item-aside-btn ${btnSetting === "member-request" ? 'activeBlue' : ''}`} >
                        <FriendAdd className="friend-add-icon"></FriendAdd>
                        <p>Member request</p>
                    </div>

                </div>
                <div className={cn(`settings-item-aside ${btnSetting === "group-settings" ? 'activeBlue' : ''}`, className)} onClick={() => { setBtnSetting("group-settings") }}>
                    <div className={`item-aside-btn ${btnSetting === "group-settings" ? 'activeBlue' : ''}`} >
                        <Gear className="gear-icon"></Gear>
                        <p>Group settings</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;