import cn from "classnames";
import React from "react";
import { useNavigate} from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import Button from "../../../../../../components/Buttons/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateGroupById } from "../../../../../../store/slices/groupsSlice";
import { useParams } from "react-router-dom";
import "./SetGroupName.scss";

const SetGroupName = (props) => {
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

    const nameRegExp =
        /^(?!\s)(?!.*\s$)(?!.*\s\s)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9\s\-']+$/;
    const descriptionRegExp =
        /^(?!\s)(?!.*\s$)(?!.*\s\s)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9\s\-']+$/;

    const validationSchema = yup.object({
        name: yup.string()
            .matches(
                nameRegExp,
                "Use letters,numbers,without extra spaces."
            )
            .min(2, "Too Short! Use more than 1 characters.")
            .max(25, "Too Long! Use less than 25 characters.")
            .required("Required"),

        description: yup.string()
            .matches(
                descriptionRegExp,
                "Use letters,numbers,without extra spaces."
            )
            .min(2, "Too Short! Use more than 1 characters.")
            .max(50, "Too Long! Use less than 50 characters.")
            .required("Required"),
    });

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
        <div className={cn("set-group-name-wrapper", className)}>
            <p className="item-title">Name and description</p>
            <Formik

                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit = {handleSubmit}
            >
                {({ errors, touched, values, handleChange, dirty, handleReset, ...props }) => (
                    <Form>
                        <div className="set-name-wrapper">
                            <Field
                                autoComplete="off"
                                type="text"
                                name="name"
                                value={values.name}
                                placeholder={name}
                                className="set-group-name"
                                onChange={handleChange}
                            />
                            {touched.name && errors.name && <div className="error">{errors.name}</div>}
                        </div>

                        <div className="set-description-wrapper">
                            <Field
                                autoComplete="off"
                                // type="text"
                                as="textarea"
                                contenteditable="true"
                                name="description"
                                value={values.description}
                                placeholder={description}
                                className="set-group-description"
                                onChange={handleChange}
                            />
                            {touched.description && errors.description && <div className="error">{errors.description}</div>}
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
        </div >
    )
}

export default SetGroupName