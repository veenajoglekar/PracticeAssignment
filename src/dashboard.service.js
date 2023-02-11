import axios from "axios";

const baseUrl = "https://blue-journalist-bbrpv.ineuron.app:4000"

const getUsers = () => {
    return axios.get(`${baseUrl}/users`).then(
        (response) => {
            return response.data;
        }
    );
}

export default {
    getUsers
}