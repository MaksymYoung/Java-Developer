import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

const initialState = {
    isFormRegistrationModal: false,
    registrationError: null,
    registrationSuccessMessage: null,
    accessToken: null,
    refreshToken: null,
    userId: null,
    passwordResetSuccess: null,
    resetPasswordToken: null,
    passwordConfirmSuccess: null,
    searchResults: null,
    searchError: null,
    selectedUserId: null,
    userData: null,
    isTokenValid: null,
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/users/register", userData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 409) {
                return rejectWithValue("Such a user already exists, use this email for sign in: ");
            } else if (error.response && error.response.status === 404) {
                return rejectWithValue("The service is not responding, please try again later.");
            }
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/login", userData);
            return response.data; // data should contain access and refresh tokens

        } catch (error) {
            // console.error("Login error:", error);
            if (error.response && error.response.status === 404) {
                return rejectWithValue("Invalid email or password");
            }
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for Forgot Password User
export const forgotPasswordUser = createAsyncThunk(
    "user/forgotPasswordUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/users/forgot-password", userData);
            const resetPasswordToken = response.data;
            return {
                resetPasswordToken,
                message: "Password reset link sent to your email, please use it."
            };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return rejectWithValue("We found no such account. Try to change the information.");
            }
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for reset password
export const resetPasswordUser = createAsyncThunk(
    "user/resetPasswordUser",
    async (userData, { rejectWithValue }) => {
        try {
            await axiosInstance.post("/api/v1/users/reset-password", userData);
            return {
                message: "Password has been successfully reset. Use form authorization for sign in:"
            };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return rejectWithValue("You have created a new password, use it in the authorization form:");
            }
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for search users by name
export const searchUsersByName = createAsyncThunk(
    "user/searchUsersByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/searchByName?name=${name}`);
            return response.data; // Повертайте дані користувачів
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for search user data by ID
export const searchUsersById = createAsyncThunk(
    "user/searchUsersById",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/${userId}`);
            return { ...response.data, userId };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for check is Access Token alive?
export const checkTokenValidity = createAsyncThunk(
    "user/checkTokenValidity",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return rejectWithValue("No token found");

        try {
            const response = await axiosInstance.post(`/api/v1/jwt/jwtTokenAlive?accessToken=${token}`);
            if (response.status === 200) {
                return true; // Токен дійсний
            } else {
                return rejectWithValue(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            // console.error("Token validation error:", error);
            return rejectWithValue(`Error validating token: ${error.message}`);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        actionToggleFormRegistrationModal: (state) => {
            state.isFormRegistrationModal = !state.isFormRegistrationModal;
            state.registrationError = null;
        },
        clearRegistrationError: (state) => {
            state.registrationError = null;
        },
        clearSuccessMessage: (state) => {
            state.passwordResetSuccess = null;
            state.passwordConfirmSuccess = null;
            state.registrationSuccessMessage = null;
        },
        actionLogOutUser: (state) => {
            // console.log("Logging out user...");
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setRegistrationSuccessMessage: (state, action) => {
            state.registrationSuccessMessage = action.payload;
        },
        setSelectedUserId: (state, action) => {
            state.selectedUserId = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registrationError = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.error("Registration failed:", action.payload);
                state.registrationError = action.payload;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // console.log("Login successful, saving tokens...");
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                const decodedToken = jwtDecode(action.payload.accessToken);
                state.userId = decodedToken.userId;
                // console.log("Authorized user:", state.userId);
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
                // localStorage.setItem("userId", decodedToken.userId);
                state.registrationError = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.error("Login failed:", action.payload);
                state.registrationError = action.payload;
            })
            .addCase(forgotPasswordUser.fulfilled, (state, action) => {
                state.registrationError = null;
                state.passwordResetSuccess = action.payload.message;
                state.resetPasswordToken = action.payload.resetPasswordToken;
                localStorage.setItem("resetPasswordToken", action.payload.resetPasswordToken);
            })
            .addCase(forgotPasswordUser.rejected, (state, action) => {
                console.error("forgotPasswordUser failed:", action.payload);
                state.registrationError = action.payload;
                state.passwordResetSuccess = null;
            })
            .addCase(resetPasswordUser.fulfilled, (state, action) => {
                state.registrationError = null;
                state.passwordConfirmSuccess = action.payload.message;
                // console.log("passwordConfirmSuccess: ", state.passwordConfirmSuccess);
            })
            .addCase(resetPasswordUser.rejected, (state, action) => {
                console.error("Reset password failed:", action.payload);
                state.registrationError = action.payload;
                state.passwordConfirmSuccess = null;
            })
            .addCase(searchUsersByName.fulfilled, (state, action) => {
                // console.log("Search Results:", action.payload);
                state.searchResults = action.payload;
            })
            .addCase(searchUsersByName.rejected, (state, action) => {
                state.searchError = action.payload;
            })
            .addCase(searchUsersById.fulfilled, (state, action) => {
                state.userData = action.payload;
            })
            .addCase(searchUsersById.rejected, (state, action) => {
                console.error("Search failed:", action.payload);
                state.userData = null;
            })
            .addCase(checkTokenValidity.fulfilled, (state) => {
                state.isTokenValid = true;
            })
            .addCase(checkTokenValidity.rejected, (state) => {
                state.isTokenValid = false;
            });
    }
});

export const {
    actionToggleFormRegistrationModal,
    clearRegistrationError,
    clearSuccessMessage,
    actionLogOutUser,
    setTokens,
    setRegistrationSuccessMessage,
    setSelectedUserId,
    setUserId,
} = userSlice.actions;

export default userSlice.reducer;
