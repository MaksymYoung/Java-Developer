import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import {
  InputSelect,
  EditTextInput,
  optionsDays,
  optionsMonths,
  optionsYears,
} from "../../../../components/Forms/FormEditProfile";

const ThriceField = ({ name }) => {
  const isEditVisible = useSelector((state) => state.editProfile.isEditVisible);

  const fieldNameFirst = "day";
  const fieldNameSecond = "month";
  const fieldNameThird = "year";

  return !isEditVisible[name] ? (
    <EditTextInput name={name} />
  ) : (
    <div className="input-edit__wrapper-two">
      <InputSelect name={fieldNameSecond} options={optionsMonths} />
      <InputSelect name={fieldNameFirst} options={optionsDays} />
      <InputSelect name={fieldNameThird} options={optionsYears} />
    </div>
  );
};

ThriceField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ThriceField;
