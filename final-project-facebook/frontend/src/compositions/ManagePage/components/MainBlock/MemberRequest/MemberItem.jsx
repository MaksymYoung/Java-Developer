import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserIcon from "../../../../../icons/user.svg?react";
import Button from "../../../../../components/Buttons/Button/Button.jsx";
import { actionGetAllAvatars } from "../../../../../store/slices/avatarSlice";
import "./MemberRequestSection.scss";

const MemberItem = (props) => {
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const dispatch = useDispatch();
    const { className, children, groupId, friend, handleReject, handleApprove, ...restProps } = props;
    const avatars = useSelector((state) => state.avatar.avatars);
    useEffect(() => {
        dispatch(actionGetAllAvatars({ userId: friend.userId }));
    }, [avatars]);

    return (
        <div className={cn("request-members", className)}>
            <div className="member-info">
                <div className="user-icon">
                    {avatars && avatars[friend.userId] ?
                        <img
                            className="user-img"
                            src={`${baseURL}${avatars[friend.userId]}`}
                            alt={`Avatar of ${friend?.firstName || "User"}`}
                        />
                        : <UserIcon className="icon" />}
                </div>
                <p>
                    {friend?.firstName || "Loading..."}&nbsp;
                    {friend?.lastName || ""}
                </p>

            </div>
            <div className="buttons-list">
                <Button type="button" className="fb-gray reject" onClick={() => { handleReject(friend.joinId) }}>
                    Reject
                </Button>
                <Button type="button" className="fb-dark-blue join" onClick={() => { handleApprove(friend.joinId) }}>
                    Approve
                </Button>
            </div>
        </div>
    )
}

export default MemberItem