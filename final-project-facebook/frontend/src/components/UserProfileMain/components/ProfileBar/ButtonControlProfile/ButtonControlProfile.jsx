import React from "react";
import { useNavigate } from "react-router-dom";

import "./ButtonControlProfile.scss";

import { ButtonClassic, ButtonPlateRectangle } from "../../../../Buttons";
import { ArrowDownIcon } from "../../../../../icons";

const ButtonControlProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="profile-rule">
      <div className="profile-rule__btn-wrapper_classic">
        <ButtonClassic
          className="fb-primary icon plus"
          onClick={() => navigate("/friends")}
        >
          <span className="btn-text">Add friends</span>
        </ButtonClassic>
        <ButtonClassic
          className="fb-secondary icon pencil"
          onClick={() => navigate("/profile-edit")}
        >
          <span className="btn-text">Edit profile</span>
        </ButtonClassic>
      </div>
      <div className="profile-rule__btn-wrapper_rectangle">
        <ButtonPlateRectangle className="profile-btn__dots">
          <ArrowDownIcon className="icon__element arrow-down" />
        </ButtonPlateRectangle>
      </div>
    </div>
  );
};

export default ButtonControlProfile;
