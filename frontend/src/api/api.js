import axios from "axios";


const BASE_URL = import.meta.env.BASE_URL;

export const registerUser = async (formData) => {
    const response = await axios.post(`${BASE_URL}`, formData);
    return response.data;
};

export const loginUser = async (formData) => {
    const response = await axios.post(`${BASE_URL}`, formData);
    return response.data;
}