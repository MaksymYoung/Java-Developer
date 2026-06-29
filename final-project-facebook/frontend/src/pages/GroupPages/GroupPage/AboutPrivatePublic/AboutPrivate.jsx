import React from "react";
import EyeIcon from "../../../../icons/eye.svg?react";
import LockIcon from "../../../../icons/lock.svg?react";
import "./../GroupPage.scss";

function AboutPrivate() {
  return (
    <>
      <div className="group-page-about__grouptype-wrapper">
        <LockIcon />
        <span className="group-page-about__name">Private</span>
      </div>
      <p className="group-page-about__grouptype-desc">
        Only members can see who's in the group and what they post.
      </p>
      <div className="group-page-about__grouptype-wrapper">
        <EyeIcon />
        <span className="group-page-about__name">Visible</span>
      </div>
      <p className="group-page-about__grouptype-desc">
        Anyone can find this group.
      </p>
    </>
  );
}

export default AboutPrivate;
