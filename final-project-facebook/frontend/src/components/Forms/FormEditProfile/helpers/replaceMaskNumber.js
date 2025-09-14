import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actionGetDataAuthUser } from "../../../../store/slices/editThunkSlice";

const replaceMaskNumber = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionGetDataAuthUser({ userId }));
  }, [dispatch, userId]);

  const authData = useSelector((state) => state.editThunk.authData);
  const phoneNumberValue = authData.phoneNumber;
  if (!phoneNumberValue) return "";

  const cleaned = phoneNumberValue.replace(/\D/g, "");
  if (cleaned.length < 10) {
    return "";
  }

  const countryCode = cleaned.slice(0, 2);
  const areaCode = cleaned.slice(2, 5);
  const part1 = cleaned.slice(5, 7);
  const part2 = cleaned.slice(7, 9);
  const part3 = cleaned.slice(9, 12);

  const phoneNumber = `+${countryCode} (${areaCode}) ${part1}-${part2}-${part3}`;

  return phoneNumber;
};

export default replaceMaskNumber;
