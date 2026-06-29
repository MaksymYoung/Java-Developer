import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actionGetDataAuthUser } from "../store/slices/editThunkSlice";

const userName = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionGetDataAuthUser({ userId }));
  }, [dispatch, userId]);

  const fullname = useSelector((state) => state.editThunk.authData);
  if (!fullname) {
    return null;
  }

  const firstRawName = fullname?.firstName || "";
  const lastRawName = fullname?.lastName || "";

  const firstName = firstRawName
    ? firstRawName[0].toUpperCase() + firstRawName.slice(1)
    : "";

  const lastName = lastRawName
    ? lastRawName[0].toUpperCase() + lastRawName.slice(1)
    : "";

  const completeName = { firstName, lastName };

  return completeName;
};

export default userName;
