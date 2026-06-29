import React from "react";
import "../GroupPage.scss";
import PropTypes from "prop-types";
import GroupCreateForm from "../GroupCreateForm/GroupCreateForm";

const Discussion = ({ group }) => {

  return (
      <div className="group-page-feed">
        <GroupCreateForm />
      </div>
  );
};

Discussion.propTypes = {
  group: PropTypes.object,
};

export default Discussion;
