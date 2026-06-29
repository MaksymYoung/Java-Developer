import React from "react";
import PropTypes from "prop-types";

import "./EditFieldWrapper.scss";

import { SingleField, TwiceField, ThriceField } from "../";
import { IconWrapper } from "../../../../components/Forms/FormEditProfile";
import { ButtonPlateEdit } from "../../../Buttons";

const EditFieldWrapper = (props) => {
  const { name, placeholder } = props;

  const showSingleField = name !== "birthday" && name !== "fullname";
  const showTwoFields = name === "fullname";
  const showThreeFields = name === "birthday";

  const transformName = name === "phone" ? "phoneNumber" : name;

  return (
    <fieldset className="fieldset-inner">
      <div className="input-edit__wrapper">
        <IconWrapper name={name} />

        {showSingleField && (
          <SingleField name={transformName} placeholder={placeholder} />
        )}
        {showTwoFields && <TwiceField name={name} />}
        {showThreeFields && <ThriceField name={name} />}

        <ButtonPlateEdit field={transformName} />
      </div>
    </fieldset>
  );
};

EditFieldWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default EditFieldWrapper;
