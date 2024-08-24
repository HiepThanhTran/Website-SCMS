import axios from "axios";
import cookie from "react-cookies";

const SERVER_CONTEXT = "/Supply-Chain-Management";
const SERVER = "http://localhost:8080";

export const endpoints = {
  login: `${SERVER_CONTEXT}/api/users/login`,
  register: `${SERVER_CONTEXT}/api/users/register`,
  getCurrentUser: `${SERVER_CONTEXT}/api/users/profile`,
  updateProfile: `${SERVER_CONTEXT}/api/users/profile/update`,
};

export const authApi = () => {
  // const token = cookie.load("token").trim();
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: cookie.load("token"),
    },
  });
};

export default axios.create({
  baseURL: SERVER,
});
