import React, { useEffect, useRef } from "react";
import "./ChatModalRename.scss";
import ModalWrapper from "../../../components/modalComponents/ModalWrapper";
import ModalBox from "../../../components/modalComponents/ModalBox";
import CloseIcon from "../../../icons/close.svg?react";
import { useDispatch } from "react-redux";
import { renameGroupChat } from "../../../store/slices/groupChatsSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Buttons/Button/Button";
import PropTypes from 'prop-types';

const ChatModalRename = ({ setIsModalRename, groupId }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRenameRef = useRef(null);

  useEffect(() => {
    if (modalRenameRef.current) {
      modalRenameRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRenameGroupChat(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRenameGroupChat(modalRenameRef.current.value);
  };

  const handleRenameGroupChat = async (name) => {
    const resultAction = await dispatch(
      renameGroupChat({ groupId: groupId, name: name })
    );

    if (renameGroupChat.fulfilled.match(resultAction)) {
      const groupId = resultAction.payload.id;
      setIsModalRename(false);
      navigate(`/messages/${groupId}`);
    } else {
      console.error("Failed to create group chat");
    }
  };

  return (
    <ModalWrapper onClick={() => setIsModalRename(false)}>
      <ModalBox>
        <div className="modal-rename-title-wrapper">
          <h3 className="modal-rename-title">Change chat name</h3>
          <CloseIcon
            className="modal-rename-close"
            onClick={() => setIsModalRename(false)}
          />
        </div>
        <p className="modal-rename-desc">
          Changing the name of a group chat changes it for everyone.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={modalRenameRef}
            className="modal-rename-input"
            type="text"
            onKeyUp={handleKeyPress}
          />
          <div className="modal-rename-btn-wrapper">
            <Button
              className="fb-gray modal-rename-btn-cancel"
              onClick={() => setIsModalRename(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </ModalBox>
    </ModalWrapper>
  );
};

ChatModalRename.propTypes = {
    setIsModalRename: PropTypes.func,
    groupId: PropTypes.number
}

export default ChatModalRename;
