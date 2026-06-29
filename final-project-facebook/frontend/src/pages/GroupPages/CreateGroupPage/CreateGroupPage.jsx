import React, { useEffect, useRef, useState } from "react";
import "./CreateGroupPage.scss";
import Aside from "../../../compositions/Aside/Aside";
import TitleAside from "../../../components/TitleAside/TitleAside";
import Feed from "../../../compositions/Feed/Feed";
import { Formik, Form, Field } from "formik";
import Button from "../../../components/Buttons/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCreatedGroup, createGroup } from "../../../store/slices/groupsSlice";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import BackIcon from "../../../icons/arrow-back.svg?react";
import CreateGroup from "./CreateGroup";
import EarthIcon from "../../../icons/earth.svg?react";
import LockIcon from "../../../icons/lock.svg?react";
import DownArrow from "../../../icons/down-arrow-filled.svg?react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../../helpers/useClickOutside";

const CreateGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const [titleName, setTitleName] = useState("Group Name");
  const [groupType, setGroupType] = useState("");
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const dropDownRef = useRef(null);
  useClickOutside(dropDownRef, () => setDropDownOpen(false));

  const createdGroup = useSelector((state) => state.groups.createdGroup);

  const initialValues = {
    name: "",
    coverImageUrl: "",
    description: "",
    groupType: "",
    members: [],
  };

  const validation = yup.object({
    name: yup.string().required("Group name is required"),
    coverImageUrl: yup.string(),
    groupType: yup.string().required("Group type is required"),
  });

  const handleName = (e) => {
    setTitleName(e.target.value);
  };

  const handleGroupTypeChange = (value) => {
    setGroupType(value);
    setDropDownOpen(false);
  };

  useEffect(() => {
    if (createdGroup && createdGroup.id) {
      navigate(`/groups/${createdGroup.id}/manage-group`);
      dispatch(clearCreatedGroup())
    }
  }, [dispatch, createdGroup, navigate]);

  return (
    <div className="create-group-page-wrapper">
      <Aside className={`create-group-aside`}>
        <div className="create-group-aside__title-wrapper">
          <BackIcon className="back" onClick={goBack} />
          <TitleAside className="create-group-aside__title">
            Create group
          </TitleAside>
        </div>
        <div className="create-group-user">
          <img className="create-group-user__img"></img>
          <div className="create-group-user__info">
            <p className="create-group-user__name"></p>
            <p className="create-group-user__role"></p>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values, { resetForm }) => {
            dispatch(createGroup(values));
            setGroupType("");
            setTitleName("Group Name");
            resetForm();
          }}
        >
          {({ errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <fieldset>
                <Field
                  type="text"
                  // id="name"
                  name="name"
                  placeholder="Group name"
                  className="create-group-input"
                  onChange={(e) => {
                    handleName(e);
                    handleChange(e);
                  }}
                />
                {errors.name && touched.name && (
                  <div className="error">{errors.name}</div>
                )}
                <div ref={dropDownRef} className="custom-dropdown create-group-input">
                  <DownArrow className="custom-dropdown__icon" />
                  <div
                    className="custom-dropdown__selected"
                    onClick={() => setDropDownOpen(!dropDownOpen)}
                  >
                    {groupType ? (
                      groupType === "Public" ? (
                        <div className="custom-dropdown__selected-type">
                          <EarthIcon />
                          {groupType}
                        </div>
                      ) : (
                        <div className="custom-dropdown__selected-type">
                          <LockIcon />
                          {groupType}
                        </div>
                      )
                    ) : (
                      "Choose privacy"
                    )}
                  </div>
                  {dropDownOpen && (
                    <div className="custom-dropdown__options">
                      <div
                        className="custom-dropdown__option"
                        onClick={() => {
                          handleGroupTypeChange("Public");
                          setFieldValue("groupType", "OPEN");
                        }}
                      >
                        <EarthIcon />
                        <div className="custom-dropdown__option-info">
                          <p className="custom-dropdown__option-name">Public</p>
                          <p className="custom-dropdown__option-desc">
                            Anyone can see who's in the group and what the post.
                          </p>
                        </div>
                      </div>
                      <div
                        className="custom-dropdown__option"
                        onClick={() => {
                          handleGroupTypeChange("Private");
                          setFieldValue("groupType", "PRIVATE");
                        }}
                      >
                        <LockIcon />
                        <div className="custom-dropdown__option-info">
                          <p className="custom-dropdown__option-name">
                            Private
                          </p>
                          <p className="custom-dropdown__option-desc">
                            Only membrs can see who's in the group and what the
                            post.
                          </p>
                        </div>
                      </div>
                      <div className="create-group__hr aside-hr"></div>
                      <p className="custom-dropdown__privacy">
                        Learn more about
                        <Link
                          to={"#"}
                          className="custom-dropdown__privacy-link"
                        >
                          group privacy
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
                {errors.groupType && touched.groupType && (
                  <div className="error">{errors.groupType}</div>
                )}
                <div>
                  <Field
                    placeholder="invite friends"
                    type="text"
                    // id="members"
                    name="members"
                    className="create-group-input"
                  />
                  {errors.members && touched.members && (
                    <div className="error">{errors.members}</div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="fb-gray create-group-btn"
                // onClick={() => navigate(`/groups/${createGroup.id}`)}
                >
                  Create Group
                </Button>
              </fieldset>
            </Form>
          )}
        </Formik>
      </Aside>
      <Feed className="create-group-main">
        <CreateGroup name={titleName} groupType={groupType} />
      </Feed>
    </div>
  );
};

export default CreateGroupPage;
