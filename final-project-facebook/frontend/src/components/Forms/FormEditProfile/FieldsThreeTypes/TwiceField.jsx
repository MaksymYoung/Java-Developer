import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  InputEdit,
  EditTextInput,
} from "../../../../components/Forms/FormEditProfile";

const TwiceField = ({ name }) => {
  const isEditVisible = useSelector((state) => state.editProfile.isEditVisible);

  const fieldNameFirst = "firstName";
  const fieldNameSecond = "lastName";

  const placeholderFirst = "First Name";
  const placeholderSecond = "Last Name";

  return !isEditVisible[name] ? (
    <EditTextInput
      name={name}
      fieldNameFirst={fieldNameFirst}
      fieldNameSecond={fieldNameSecond}
    />
  ) : (
    <div className="input-edit__wrapper-two">
      <InputEdit name={fieldNameFirst} placeholder={placeholderFirst} />
      <InputEdit name={fieldNameSecond} placeholder={placeholderSecond} />
    </div>
  );
};

TwiceField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TwiceField;
