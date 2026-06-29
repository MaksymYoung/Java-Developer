import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";
import "./EditProfilePage.scss";

import {
  FieldsetSection,
  EditFieldWrapper,
} from "../../components/Forms/FormEditProfile";

import { ButtonClassic } from "../../components/Buttons";
import Loader from "../../components/Loader/Loader";
import {
  actionGetDataAuthUser,
  actionGetDataEditProfile,
  actionPutUserThunk,
} from "../../store/slices/editThunkSlice";
import { setFormikProps } from "../../store/slices/editProfileSlice";
import {
  validationEditProfile,
  replaceMaskNumber,
} from "../../components/Forms/FormEditProfile/";

const EditProfilePage = () => {
  const userId = getUserIdFromToken();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionGetDataAuthUser({ userId }));
    dispatch(actionGetDataEditProfile({ userId }));
  }, [dispatch, userId]);

  const authData = useSelector((state) => state.editThunk.authData);
  const editData = useSelector((state) => state.editThunk.editData);
  const loading = useSelector((state) => state.editThunk.loading);

  const replaceNulls = (obj) => {
    const createArrow = Object.entries(obj);
    const replaceNullsFromArrow = createArrow.map(([key, value]) => [
      key,
      value === null ? "" : value,
    ]);
    const returnObject = Object.fromEntries(replaceNullsFromArrow);
    return returnObject;
  };

  const replaceStringWithEmpty = (value) => (value === "string" ? "" : value);

  const normalizeData = (data) => ({
    ...data,
    interests: replaceStringWithEmpty(data.interests),
    linkedin: replaceStringWithEmpty(data.linkedin),
    telegram: replaceStringWithEmpty(data.telegram),
    viber: replaceStringWithEmpty(data.viber),
  });

  const initialValues = replaceNulls({
    ...authData,
    ...normalizeData(editData),
    phoneNumber: replaceMaskNumber(userId),
  });

  if (loading || !initialValues || Object.keys(initialValues).length === 0) {
    return <Loader className="loader-edit" />;
  }

  const handleSubmit = (values) => {
    const birthDate = `${values.year}-${values.month}-${values.day}`;
    const normalizePhoneNumber = values.phoneNumber.replace(/[^0-9]/g, "");

    const updateValues = {
      ...values,
      birthDate,
      phoneNumber: normalizePhoneNumber,
    };
    dispatch(actionPutUserThunk({ userData: updateValues, userId }));
  };

  return (
    <div className="page__edit-wrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationEditProfile}
      >
        {(formikProps) => {
          useEffect(() => {
            const serializedFormikProps = {
              values: formikProps.values,
              errors: formikProps.errors,
              touched: formikProps.touched,
            };
            dispatch(setFormikProps(serializedFormikProps));
          }, [formikProps]);

          return (
            <Form className="form-edit">
              <FieldsetSection sectionName="General Information">
                <EditFieldWrapper name="fullname" />
                <EditFieldWrapper name="birthday" />
                <EditFieldWrapper name="phone" />
                <EditFieldWrapper name="gender" />
                <EditFieldWrapper name="interests" />
              </FieldsetSection>

              <FieldsetSection sectionName="Social">
                <EditFieldWrapper name="linkedin" />
                <EditFieldWrapper name="telegram" />
                <EditFieldWrapper name="viber" />
              </FieldsetSection>

              <ButtonClassic className="fb-transparent" type="submit">
                Save
              </ButtonClassic>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditProfilePage;
