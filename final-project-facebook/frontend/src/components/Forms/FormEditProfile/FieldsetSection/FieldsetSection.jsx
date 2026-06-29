import React from "react";
import PropTypes from "prop-types";

import "./FieldsetSection.scss";

const FieldsetSection = ({ children, sectionName }) => {
  return (
    <fieldset className="fieldset-section">
      <legend className="legend-section">{sectionName}</legend>
      {children}
    </fieldset>
  );
};

FieldsetSection.propTypes = {
  children: PropTypes.any,
  sectionName: PropTypes.string.isRequired,
};

export default FieldsetSection;
