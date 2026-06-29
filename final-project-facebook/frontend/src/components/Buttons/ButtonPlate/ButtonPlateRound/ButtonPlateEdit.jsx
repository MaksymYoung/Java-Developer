import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import "./ButtonPlateRound.scss";

import ButtonPlate from "../ButtonPlate";
import { EditPenIcon } from "../../../../icons/editProfile";
import { setIsEditVisible } from "../../../../store/slices/editProfileSlice";

const ButtonPlateEdit = ({ field }) => {
  const dispatch = useDispatch();
  const isEditVisible = useSelector((state) => state.editProfile.isEditVisible);

  const toggleEdit = () => {
    dispatch(setIsEditVisible({ field, isVisible: !isEditVisible[field] }));
  };

  return (
    <div className="icon-position">
      <ButtonPlate className="btn-plate__round edit" onClick={toggleEdit}>
        <EditPenIcon className="icon__element edit-pen" />
      </ButtonPlate>
    </div>
  );
};

ButtonPlateEdit.propTypes = {
  field: PropTypes.string.isRequired,
};

export default ButtonPlateEdit;
