import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
    const TOKEN_ACCESS = localStorage.getItem("accessToken");

    if (typeof TOKEN_ACCESS === "string") {
        const decodedToken = jwtDecode(TOKEN_ACCESS);
        return decodedToken?.userId || null;
    }
    return null

};
