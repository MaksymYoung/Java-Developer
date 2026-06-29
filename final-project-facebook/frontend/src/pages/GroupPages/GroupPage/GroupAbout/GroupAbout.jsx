import React from "react";
import "../GroupPage.scss";
import AboutPrivate from "../AboutPrivatePublic/AboutPrivate";
import AboutPublic from "../AboutPrivatePublic/AboutPublic";
import PropTypes from "prop-types";

const GroupAbout = ({ group }) => {

  return (
    <>
      <div className="group-page-aside">
        <div className="group-page-about">
          <h3 className="group-page-about__title">About</h3>
          <p className="group-page-about__about">{group.description}</p>
          {group.groupType === "PRIVATE" ? <AboutPrivate /> : <AboutPublic />}
        </div>
      </div>
    </>
  );
};

GroupAbout.propTypes = {
  group: PropTypes.object,
};

export default GroupAbout;
