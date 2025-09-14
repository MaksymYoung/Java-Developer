import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { searchUsersById } from "../../../store/slices/userSlice";
import { actionGetAllAvatars } from "../../../store/slices/avatarSlice";
import "./ChatsModalAddItem.scss";
import { addMemberGroupChat } from "../../../store/slices/groupChatsSlice";

const ChatsModaAddlItem = (props) => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const { friendId, groupId, setIsModal } = props;
  const dispatch = useDispatch();
  const [friendName, setFriendName] = useState("");
  const [friendImgPath, setFriendImgPath] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await dispatch(
        searchUsersById({ userId: friendId })
      ).unwrap();
      const avatarPath = await dispatch(
        actionGetAllAvatars({ userId: friendId })
      ).unwrap();
      setFriendName(userData);
      setFriendImgPath(avatarPath);
    };

    fetchUserData();
  }, [dispatch, friendId]);

  const handleAddToChat = () => {
    dispatch(addMemberGroupChat({ groupId: groupId, userId: friendId }));
    setIsModal(false);
  };

  return (
    <div className="chat-modal-friend" onClick={handleAddToChat}>
      <img
        className="chat-modal-friend__img"
        src={friendImgPath ? `${baseURL}${friendImgPath}` : ""}
        alt={friendName?.firstName}
      />
      <p className="chat-modal-friend__name">
        {friendName?.firstName} {friendName?.lastName}
      </p>
    </div>
  );
};

ChatsModaAddlItem.propTypes = {
  friendId: PropTypes.number,
  groupId: PropTypes.number,
  setIsModal: PropTypes.func,
}

export default ChatsModaAddlItem;
