const handleErrorThunk = (error, rejectWithValue) => {
  // console.error("Something in Axios had gone wrong", error);

  if (error.response) {
    if (error.response.status === 404) {
      // console.error("Code 404: ", error.response.status);
      return rejectWithValue("");
    }
    console.error("Error Status Code: ", error.response.status);
    console.error("Error Response Data: ", error.response.data);
  } else if (error.request) {
    console.error("No response received from server", error.request);
  } else {
    console.error("Error in setting up request", error.message);
  }
  return rejectWithValue("");
};

export default handleErrorThunk;
