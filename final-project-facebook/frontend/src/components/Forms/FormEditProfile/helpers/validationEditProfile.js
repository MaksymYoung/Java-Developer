import * as yup from "yup";

const requiredText = "The field is required";

const fullName = yup
  .string()
  .required(requiredText)
  .min(2, "The name is too short (min 2 letters)")
  .max(16, "The name is too long (max 16 letters)")
  .matches(/^[a-zA-Z0-9' \-\–—]+$/, "Only Latin letters allowed");

const phoneValidation = yup
  .string()
  .nullable()
  .optional()
  .transform((value) => value || "")
  .matches(/^[0-9()+\- ]*$/, "Invalid phone number format")
  .test(
    "min-digits",
    "Too short. The phone number must contain at least 10 digits",
    (value) => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10;
    }
  );

const interestsValid = yup
  .string()
  .max(21, "The title is too long (max 21 letters)")
  .nullable()
  .optional()
  .test("is-latin", "Only Latin letters allowed", (value) => {
    if (!value) return true;
    return /^[a-zA-Z\s]+$/.test(value.replace(/[^a-zA-Z\s]/g, ""));
  })
  .test("valid-characters", "Invalid characters in Interests", (value) => {
    if (!value) return true;
    return /^[a-zA-Z0-9\s\+\-\–:;@#$№&*()\/?!|'"\\]*$/.test(value);
  });

const socialValid = yup
  .string()
  .matches(/^[a-zA-Z0-9@\/\-_.]+$/, "Unacceptable entry");

const validationEditProfile = yup.object({
  firstName: fullName,
  lastName: fullName,
  phoneNumber: phoneValidation,
  interests: interestsValid,
  linkedin: socialValid,
  telegram: socialValid,
});

export default validationEditProfile;
