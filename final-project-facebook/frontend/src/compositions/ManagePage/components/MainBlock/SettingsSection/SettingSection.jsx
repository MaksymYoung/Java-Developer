import cn from "classnames";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pencil from "../../../../../icons/pencil-icon.svg?react";
import SetGroupName from "../SettingsSection/SetGroupName/SetGroupName"
import SetPrivacy from "./SetPrivacy/SetPrivacy";
import InviteToGroupModal from "../../../../../components/GroupsComponents/InviteToGroup/InviteToGroupModal"
import LeaveGroup from "./LeaveGroup/LeaveGroup";
import { allFriends } from "../../../../../store/slices/friendSlice";
import "./SettingSection.scss";


const SettingMainBlock = (props) => {
    const dispatch = useDispatch();
    const { className, groupType, name, description, groupId, ...restProps } = props;

    const escKey = (event) => {
        if (event.key === "Escape") {
            return setActiveElement("");
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escKey);
        return
    }, [])

    const [activeElement, setActiveElement] = useState("");
    const btnActive = (section) => {
        setActiveElement(section)
    };

    const cancel = (btncancel) => {
        if (btncancel === "cancel") {
            setActiveElement("")
        }
    }

    const handleAllFriends = () => { dispatch(allFriends()) };
    const handleInviteFriend = () => {
      handleAllFriends();
    }

    return (
        <>
            <div className="settings-wrapper">
                <p className="settings-title">Group settings</p>

                <div className={cn(`settings-item main-block item-section ${activeElement !== "" ? "slide-down" : ""}`, className)} >
                    {activeElement === "name" ? <SetGroupName onCancel={cancel} name={name} description={description} groupId={groupId}></SetGroupName>
                        : <p className="setting-group-name">Name and description</p>}
                    {activeElement === "name" ? "" : <Pencil className="setting-groups-pencil" onClick={() => { btnActive("name") }}></Pencil>}
                </div>

                <div className={cn(`settings-item main-block item-section ${activeElement !== "" ? "slide-down" : ""}`, className)}>
                    <div className="item-privacy">
                        {activeElement === "privacy" ? <SetPrivacy onCancel={cancel}></SetPrivacy>
                            :
                            <>
                                <p className="setting-privacy-text">Privacy</p>
                                <div className="setting-info privacy">
                                    <p className="status-current">{groupType}</p>
                                </div>
                            </>
                        }
                    </div>
                    {activeElement === "privacy" ? "" : <Pencil className="setting-groups-pencil" onClick={() => { btnActive("privacy") }}></Pencil>}
                </div>

                <div className={cn(`settings-item main-block item-section ${activeElement !== "" ? "slide-down" : ""}`, className)}>
                    <div className="item-section">
                        {activeElement === "invite" ? 
                        <InviteToGroupModal onCancel={cancel}></InviteToGroupModal>
                            :
                            <>
                        <p className="setting-join-text">Invite new member</p>
                        </>
                        }
                    </div>
                    {activeElement === "invite" ? "" : <Pencil className="setting-groups-pencil" onClick={() => { btnActive("invite"); handleInviteFriend() }}></Pencil>}
                </div>

                <div className={cn(`settings-item main-block item-section ${activeElement !== "" ? "slide-down" : ""}`, className)}>
                    <div className="item-section">
                    {activeElement === "leave-group" ? 
                    <LeaveGroup onCancel={cancel}></LeaveGroup>
                            :
                            <>
                        <p className="setting-join-text">Leave group</p>
                        </>
                        }
                    </div>
                    {activeElement === "leave-group" ? "" : <Pencil className="setting-groups-pencil" onClick={() => { btnActive("leave-group") }}></Pencil>}
                </div>
            </div>
        </>
    );
};

export default SettingMainBlock;
