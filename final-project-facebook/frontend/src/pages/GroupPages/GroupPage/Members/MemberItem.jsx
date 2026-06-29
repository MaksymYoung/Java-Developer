import React, { useState, useEffect } from "react";
import cn from "classnames";
import { Link, useNavigate, useParams } from "react-router-dom";
import FriendIcon from "../../../../icons/friends/friend-fill.svg?react"
import { useDispatch, useSelector } from "react-redux";
import { actionGetAllAvatars } from "../../../../store/slices/avatarSlice";
import axiosInstance from "../../../../helpers/axiosInstance.js";
import { setSelectedUserId } from "../../../../store/slices/userSlice.js";
import "./GroupMembers.scss";

const MemberItem = (props) => {
    const { member, ...restProps } = props;
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selected, setSelected] = useState(false);
    const handleSeledted = (friendId) => {
        setSelected(prevState => prevState ? false : true);
    };

    const [userInfo, setUserInfo] = useState({});
    const avatars = useSelector((state) => state.avatar.avatars);

    useEffect(() => {
        const membersInfo = async () => {
            let details = [];
            try {
                const response = await axiosInstance.get(`/api/v1/users/${member}`);
                details = { userId: member, ...response.data }
                dispatch(actionGetAllAvatars({ userId: member }));
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
            setUserInfo(details);
        };
        membersInfo()
    }, [dispatch]);

    const handleUserSelect = (userId) => {
        console.log(userId);
        // localStorage.setItem("selectedUserId", userId);
        dispatch(setSelectedUserId(userId));
        navigate(`/profile-friend/${userId}`);
      };

    return (
        < div className="member-item-wrapper" >
            <div className="member-box">
                <Link onClick={() => handleUserSelect(member)}>
                    <div className="member-icon">
                        {avatars[member] ?
                            <img
                                className="user-img"
                                src={`${baseURL}${avatars[member]}`}
                                alt={`Avatar of ${userInfo?.firstName || "User"}`}
                            />
                            : <FriendIcon className="icon"></FriendIcon>}

                    </div>
                </Link>
                <Link to={`/profile-friend/${member}`}>
                    <div className="member-item">
                        {userInfo?.firstName || "Loading..."}&nbsp;
                        {userInfo?.lastName || ""}
                    </div>
                </Link>
            </div>

        </div >
    )
}
export default MemberItem

