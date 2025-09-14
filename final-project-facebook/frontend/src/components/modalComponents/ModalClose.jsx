import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

const ModalClose = ({ onClick }) => {
    return (
        <button type="button" className="modal__close" onClick={onClick}>
            X
        </button>
    )
};

ModalClose.propTypes = {
    onClick: PropTypes.func
};

export default ModalClose;
