import React, { useState, useEffect } from "react";
import cn from "classnames";
import FriendIcon from "../../../icons/friends/friend-fill.svg?react"
import Square from "../../../icons/check/square.svg?react"
import Check from "../../../icons/check/check.svg?react"
import { useDispatch, useSelector } from "react-redux";
import { addToInvitation, removeFromInvitation } from "../../../store/slices/inviteFriendToGroup"
import { actionGetAllAvatars } from "../../../store/slices/avatarSlice";
import axiosInstance from "../../../helpers/axiosInstance.js";
import "./InviteToGroupModal.scss";

const FriendItem = (props) => {
    const { friend, onSelect, ...restProps } = props;
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const dispatch = useDispatch();

    const [selected, setSelected] = useState(false);
    const handleSeledted = (friendId) => {
        setSelected(prevState => prevState ? false : true);
    };

    const handleRemove = (friendId) => {
            dispatch(removeFromInvitation(friendId));
    }

    const handleAdd = (friendId, firstName, lastName) => {
            dispatch(addToInvitation({friendId: friendId, firstName: firstName, lastName: lastName})); 
    }

    const [userInfo, setUserInfo] = useState({});
    const avatars = useSelector((state) => state.avatar.avatars);

    useEffect(() => {
        const membersInfo = async () => {
            let details = [];
            try {
                const response = await axiosInstance.get(`/api/v1/users/${friend}`);
                details = { userId: friend, ...response.data }
                dispatch(actionGetAllAvatars({ userId: friend }));
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
            setUserInfo(details);
        };
        membersInfo()
    }, [dispatch]);

    return (
        < div className="friend-item-wrapper" >
            <div className="friend-box">
                <div className="friend-icon">
                    {avatars && avatars[friend] ?
                        <img
                            className="user-img"
                            src={`${baseURL}${avatars[friend]}`}
                            alt={`Avatar of ${userInfo?.firstName || "User"}`}
                        />
                        : <FriendIcon className="icon"></FriendIcon>}

                </div>
                <div className="friend-item">
                    {userInfo?.firstName || "Loading..."}&nbsp;
                    {userInfo?.lastName || ""}
                </div>
            </div>

            <div className="selector" onClick={() => { handleSeledted() }}>
                {selected
                    ?
                    <div className="selector-check" onClick={() => {handleRemove(friend) }}>
                        <Square className="square" />
                        <Check className="check" />
                    </div>
                    :
                    <Square onClick={() => {handleAdd(friend, userInfo.firstName, userInfo.lastName ) }} />
                }
            </div>
        </div >
    )
}
export default FriendItem

