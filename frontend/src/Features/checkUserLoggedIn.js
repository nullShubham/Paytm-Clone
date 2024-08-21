import axios from "axios"
const checkUserLoggedIn = async () => {
    const hosted = import.meta.env.VITE_SERVER_URL + "/user/me"
    try {
        const res = await axios.post(hosted, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("tokenOfAuth")
            }
        })
        return res.data.isUserLoggedIn;

    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data.isUserLoggedIn;
        } else {
            console.error("Error checking user login status:", error);
            return false;
        }
    }

}
export default checkUserLoggedIn