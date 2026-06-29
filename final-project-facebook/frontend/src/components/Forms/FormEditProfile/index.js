import FieldsetSection from "./FieldsetSection/FieldsetSection";
import EditFieldWrapper from "./EditFieldWrapper/EditFieldWrapper";
import EditTextInput from "./EditTextInput/EditTextInput";
import IconWrapper from "./IconWrapper/IconWrapper";
import InputEdit from "./InputType/InputEdit";
import InputEditMask from "./InputType/InputEditMask";
import InputSelect from "./InputType/InputSelect";

import SingleField from "./FieldsThreeTypes/SingleField";
import TwiceField from "./FieldsThreeTypes/TwiceField";
import ThriceField from "./FieldsThreeTypes/ThriceField";

import {
  optionsDays,
  optionsMonths,
  optionsYears,
} from "./helpers/optionsBirthday";
import { optionsGender } from "./helpers/optionsDefault";
import validationEditProfile from "./helpers/validationEditProfile";
import replaceMaskNumber from "./helpers/replaceMaskNumber";

export {
  FieldsetSection,
  EditFieldWrapper,
  IconWrapper,
  EditTextInput,
  InputEdit,
  InputEditMask,
  InputSelect,
};

export { SingleField, TwiceField, ThriceField };
export { optionsMonths, optionsDays, optionsYears, optionsGender };
export { validationEditProfile, replaceMaskNumber };
