import cn from "classnames";
import React, { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import Button from "../../../../../../components/Buttons/Button/Button";

import { useDispatch, useSelector } from "react-redux";
import { fetchGroupById, fetchUpdateGroupById } from "../../../../../../store/slices/groupsSlice";
import { useParams } from "react-router-dom";

import EyeOpen from "../../../../../../icons/Eye-open-f.svg?react";
import EyeClosed from "../../../../../../icons/Eye-closed-f.svg?react";
import "./SetHide.scss";

const SetHide = (props) => {
    const { className, onClick, onCancel, ...restProps } = props;

    const dispatch = useDispatch();

    const { id } = useParams();
    let groupId = Number(id);

    const group = useSelector((state) => state.groups.group);
    useEffect(() => { dispatch(fetchGroupById(groupId)) }, [dispatch, groupId]);

    const { name, description, coverImageUrl, groupType, members, ownerId } = group;

    const initialValues = {
        name: name,
        description: description,
        coverImageUrl: coverImageUrl,
        groupType: "",
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
        <div className={cn("set-hidden-wrapper", className)}>
            <p className="item-title">Hide group</p>
            <Formik
                initialValues={initialValues}
                onSubmit = {handleSubmit}
            >
                {({errors, touched, values, handleChange, dirty, handleReset, ...props }) => (
                    <Form>
                            <div className="hide-wrapper">
                                <div className="hide-icon">
                                    <EyeOpen className="icon"></EyeOpen>
                                </div>
                                <div className="hide-text-array">
                                    <p className="title">Visible</p>
                                    <p className="text">Anyone can find this group.</p>
                                </div>
                                <div>
                                    <Field
                                        type="radio"
                                        name=""
                                        className="set-group-hide"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="hide-wrapper">
                                <div className="hide-icon">
                                    <EyeClosed className="eye-closed"></EyeClosed>
                                </div>
                                <div className="hide-text-array">
                                    <p className="title">Hidden</p>
                                    <p className="text">Only members can find this group.</p>
                                </div>
                                <div>
                                    <Field
                                        type="radio"
                                        name="hidden"
                                        className="set-group-hide"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="public-attention">
                                <p>Public groups can only be visible.</p>
                            </div>
                            <div className="button-section">
                                <Button type="button" className="fb-blue cancel" onClick={() => { onCancel("cancel")}}>
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

export default SetHide