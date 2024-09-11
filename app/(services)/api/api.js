import axios from "axios";

const loginUser = async ({email, password}) => {
    const response = await axios.post(
        "https://hot-areas-play.loca.lt/api/users/login",
        {
            email,
            password
        }
    );
    return response.data;
}

const registerUser = async ({email, password}) => {
    const response = await axios.post(
        "https://hot-areas-play.loca.lt/api/users/register",
        {
            email,
            password
        }
    );
    return response.data;
}

export {loginUser, registerUser}