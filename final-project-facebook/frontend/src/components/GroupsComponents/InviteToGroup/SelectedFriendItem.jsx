import React from "react";
import FriendIcon from "../../../icons/friends/friend-fill.svg?react"
import { useDispatch, useSelector } from "react-redux";
import "./InviteToGroupModal.scss";


const SelectedFriendItem = (props) => {
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const dispatch = useDispatch();
    const { friend, onSelect, ...restProps } = props;

    const avatars = useSelector((state) => state.avatar.avatars);

    return (
        < div className="friend-item-wrapper" >
            <div className="friend-box">
                <div className="friend-icon" >
                    {avatars && avatars[friend.friendId] ?
                        <img
                            className="user-img"
                            src={`${baseURL}${avatars[friend.friendId]}`}
                            alt={`Avatar of ${friend?.firstName || "User"}`}
                        />
                        : <FriendIcon className="icon"></FriendIcon>}
                </div>
                <div className="friend-item">
                    {friend?.firstName || "Loading..."}&nbsp;
                    {friend?.lastName || ""}
                </div>
            </div>
        </div >
    )
}
export default SelectedFriendItem

