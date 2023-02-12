import axios from "axios";

const baseUrl = "https://blue-journalist-bbrpv.ineuron.app:4000"

const getUsers = () => {
    return axios.get(`${baseUrl}/users`).then(
        (response) => {
            return response.data;
        }
    );
}

const createUser = (userObj) => {
    return axios.post(`${baseUrl}/user/create`, userObj).then(
        (response) => {
            return response.data;
        }
    )
}

const updateUser = (userObj, id) => {
    return axios.patch(`${baseUrl}/user/${id}`, userObj).then(
        (response) => {
            return response.data;
        }
    )
}

const deleteUser = (userObj) => {
    return axios.delete(`${baseUrl}/user/${userObj._id}`).then(
        (response) => {
            return response.data;
        }
    )
}
export default {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}