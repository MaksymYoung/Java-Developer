import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button.jsx";
import Friends from "../../../icons/friends/friends.svg?react";
import FriendAdd from "../../../icons/friends/friendAdd.svg?react";
import FriendExpect from "../../../icons/friends/friendExpect.svg?react";
import {
    friendRequestAreFriends,
    friendRequestSend,
    friendRequestRevoke,
    allSentRequests,
    allReceivedPendingRequests
} from "../../../store/slices/friendSlice.js"
import "./ButtonFriend.scss";

const ButtonFriend = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const reduxFriendStatus = useSelector((state) => state.friend.friendStatus);
    const allPendingSentRequests = useSelector((state) => state.friend.allPendingSentRequests);

    const [localFriendStatus, setLocalFriendStatus] = useState(reduxFriendStatus);

    useEffect(() => {
        dispatch(friendRequestAreFriends({ userId: id }));
        dispatch(allSentRequests());
    }, [dispatch, id]);

    useEffect(() => {
        setLocalFriendStatus(reduxFriendStatus);
    }, [reduxFriendStatus]);

    const handleFriendRequestSend = async () => {
        setLocalFriendStatus("request_sent");
        try {
            await dispatch(friendRequestSend({ receiverId: id })).unwrap();
            dispatch({ type: 'friend/setFriendStatus', payload: 'request_sent' });
        } catch (error) {
            setLocalFriendStatus(reduxFriendStatus); // Відкат у разі помилки
            console.error("Failed to send friend request:", error);
        }
    };

    const handleFriendRequestRevoke = async () => {
        setLocalFriendStatus("not_friends");
        try {
            await dispatch(friendRequestRevoke({ id })).unwrap();
            dispatch({ type: 'friend/setFriendStatus', payload: 'not_friends' });
            // Викликаємо оновлення списку запитів
            dispatch(allSentRequests());
            dispatch(allReceivedPendingRequests());
        } catch (error) {
            setLocalFriendStatus(reduxFriendStatus); // Відкат у разі помилки
            console.error("Failed to send friend request:", error);
        }
    };

    const isRequestPending = allPendingSentRequests.some(
        (request) => String(request.receiverId) === String(id)
    );

    return (
        <>
            <div className="button-friend__wrapper">
                {localFriendStatus === "not_friends" && !isRequestPending && (
                    <Button onClick={handleFriendRequestSend} className="button-friend">
                        <div className="button-friend__icon-container">
                            <FriendAdd />
                        </div>
                        Add to friends
                    </Button>
                )}
                {(localFriendStatus === "request_sent" || isRequestPending) && (
                    <Button onClick={handleFriendRequestRevoke} className="button-friend button-friend__confirmed">
                        <div className="button-friend__icon-container">
                            <FriendExpect />
                        </div>
                        Revoke request
                    </Button>
                )}
                {localFriendStatus === "friends" && (
                    <Button className="button-friend button-friend__confirmed">
                        <div className="button-friend__icon-container">
                            <Friends />
                        </div>
                        Friends
                    </Button>
                )}
            </div>
        </>
    );
}

export default ButtonFriend;
