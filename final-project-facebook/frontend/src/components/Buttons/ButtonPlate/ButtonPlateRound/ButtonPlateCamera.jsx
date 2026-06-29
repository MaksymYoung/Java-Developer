import React from "react";
import PropTypes from "prop-types";

import "./ButtonPlateRound.scss";

import ButtonPlate from "../ButtonPlate";
import { CameraIcon } from "../../../../icons/userProfileHeader/";

const ButtonPlateCamera = ({ onClick }) => {
  return (
    <ButtonPlate className="btn-plate__round camera" onClick={onClick}>
      <CameraIcon className="icon__element camera" />
    </ButtonPlate>
  );
};

ButtonPlateCamera.propTypes = { onClick: PropTypes.func };

export default ButtonPlateCamera;
