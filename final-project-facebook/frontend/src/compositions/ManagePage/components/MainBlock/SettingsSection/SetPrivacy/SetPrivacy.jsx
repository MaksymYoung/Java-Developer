import cn from "classnames";
import React from "react";
import { Field, Form, Formik } from "formik";
import Button from "../../../../../../components/Buttons/Button/Button";
import Earth from "../../../../../../icons/earth.svg?react";
import Lock from "../../../../../../icons/lock-close.svg?react";

import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateGroupById } from "../../../../../../store/slices/groupsSlice";
import { useNavigate, Link, renderMatches } from "react-router-dom";
import { useParams } from "react-router-dom";

import "./SetPrivacy.scss";

const SetPrivacy = (props) => {
    const { className, onClick, onCancel, ...restProps } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    let groupId = Number(id);

    const group = useSelector((state) => state.groups.group);

    const { name, description, coverImageUrl, groupType, members, ownerId } = group;

    const initialValues = {
        name: name,
        description: description,
        coverImageUrl: coverImageUrl,
        groupType: groupType,
        ownerId: ownerId,
        members: members,
    };

    const handleSubmit = async (values) => {
        try {
            const putResponse = await dispatch(fetchUpdateGroupById({ groupData: values, groupId: groupId }));
            if (fetchUpdateGroupById.fulfilled.match(putResponse)) {
                onCancel("cancel")
            } else {
                console.error("Change Group name and descriptions failed ", putResponse.payload);
            }
        } catch (error) {
            console.error("Change Group name and descriptions failed ", error);
        } finally {

        }
    };

    return (
        <div className={cn("set-privacy-wrapper", className)}>
            <p className="item-title">Privacy</p>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, values, handleChange, dirty, handleReset, ...props }) => (
                    <Form>
                        <div className="privacy-wrapper">
                            <div className="privacy-icon">
                                <Earth className="icon"></Earth>
                            </div>
                            <div className="privacy-text-array">
                                <p className="title">Public</p>
                                <p className="text">Anyone can see who's in the group and what they post.</p>
                            </div>
                            <div>
                                <Field
                                    type="radio"
                                    name="groupType"
                                    value="OPEN"
                                    className="set-group-privacy"
                                    onChange={handleChange}
                                    id="OPEN"
                                />
                                {errors.groupType && touched.groupType && (<div className="error">{errors.groupType}</div>)}

                            </div>
                        </div>
                        <div className="privacy-wrapper">
                            <div className="privacy-icon">
                                <Lock className="icon"></Lock>
                            </div>
                            <div className="privacy-text-array">
                                <p className="title">Private</p>
                                <p className="text">Only members can see who's in the group and what they post.</p>
                            </div>
                            <div>
                                <Field
                                    type="radio"
                                    name="groupType"
                                    value="PRIVATE"
                                    className="set-group-privacy"
                                    onChange={handleChange}
                                    id="PRIVATE"
                                />
                                {errors.groupType && touched.groupType && (<div className="error">{errors.groupType}</div>)}
                            </div>

                        </div>

                        <div className="button-section">
                            <Button type="button" className="fb-blue cancel" onClick={() => { onCancel("cancel") }}>
                                Cancel
                            </Button>
                            <Button type="submit" className="fb-gray save" disabled={!dirty}>
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SetPrivacy