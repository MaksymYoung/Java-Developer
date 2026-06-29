import React from "react";
import PropTypes from "prop-types";
import ModalWrapper from "../modalComponents/ModalWrapper.jsx";
import ModalBox from "../modalComponents/ModalBox.jsx";
import ModalClose from "../modalComponents/ModalClose.jsx";
import Button from "../Buttons/Button/Button.jsx";
import "./ConfirmModal.scss";

const ConfirmModal = ({ onClose, onConfirm, message }) => {
    return (
        <ModalWrapper onClick={onClose}>
            <ModalBox>
                <ModalClose onClick={onClose} />
                <div className="confirm-modal__content">
                    <p>{message}</p>
                    <div className="confirm-modal__actions">
                        <Button className="fb-gray confirm-modal__button" onClick={onConfirm}>
                            Yes
                        </Button>
                        <Button className="fb-gray confirm-modal__button" onClick={onClose}>
                            No
                        </Button>
                    </div>
                </div>
            </ModalBox>
        </ModalWrapper>
    );
};

ConfirmModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
};

export default ConfirmModal;
