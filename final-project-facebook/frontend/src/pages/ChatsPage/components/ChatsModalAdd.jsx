import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "../../../components/modalComponents/ModalWrapper";
import ModalBox from "../../../components/modalComponents/ModalBox";
import { useDispatch, useSelector } from "react-redux";
import { allFriends } from "../../../store/slices/friendSlice";
import ChatsModalAddItem from "./ChatsModalAddItem";
import { getUserIdFromToken } from "../../../helpers/userIdFromAccessToken.js";
import CloseIcon from "../../../icons/close.svg?react";

const ChatsModalAdd = ({ setIsModal, groupId }) => {
  const userId = getUserIdFromToken();
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.allFriends);
  useEffect(() => {
    dispatch(allFriends(userId));
  }, [dispatch, userId]);

  return (
    <ModalWrapper onClick={() => setIsModal(false)}>
      <ModalBox>
        <div className="modal-add-title-wrapper">
          <h3 className="modal-add-title">Add people</h3>
          <CloseIcon className="modal-add-close" onClick={() => setIsModal(false)} />
        </div>
        <p className="modal-add-suggested">Suggested</p>
        <div className="chat-modal-friend-wrapper">
        {friends.map((friend) => (
          <ChatsModalAddItem
            key={friend}
            friendId={friend}
            groupId={groupId}
            setIsModal={setIsModal}
          />
        ))}
        </div>
      </ModalBox>
    </ModalWrapper>
  );
};

ChatsModalAdd.propTypes = {
  groupId: PropTypes.number,
  setIsModal: PropTypes.func,
}

export default ChatsModalAdd;
