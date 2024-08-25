import axios from "axios";
import cookie from "react-cookies";

const SERVER_CONTEXT = "/Supply-Chain-Management";
const SERVER = "http://localhost:8080";

export const endpoints = {
  login: `${SERVER_CONTEXT}/api/users/login`,
  register: `${SERVER_CONTEXT}/api/users/register`,
  getCurrentUser: `${SERVER_CONTEXT}/api/users/profile`,
  updateProfile: `${SERVER_CONTEXT}/api/users/profile/update`,
  products : `${SERVER_CONTEXT}/api/products`,
};

export const authApi = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      "Authorization": cookie.load("token")
    },
  });
};

export default axios.create({
  baseURL: SERVER,
});
