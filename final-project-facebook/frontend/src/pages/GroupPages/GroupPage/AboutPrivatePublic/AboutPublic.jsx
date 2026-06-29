import React from "react";
import EarthIcon from "../../../../icons/earth.svg?react";
import EyeIcon from "../../../../icons/eye.svg?react";
import "./../GroupPage.scss";

function AboutPublic() {
  return (
    <>
      <div className="group-page-about__grouptype-wrapper">
        <EarthIcon />
        <span className="group-page-about__name">Public</span>
      </div>
      <p className="group-page-about__grouptype-desc">
        Anyone can see who's in the group and what the post.
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

export default AboutPublic;
