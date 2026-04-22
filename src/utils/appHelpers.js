import Cookies from "js-cookie";

// tokens
export const getAccessToken = () => Cookies.get("token") || "";
