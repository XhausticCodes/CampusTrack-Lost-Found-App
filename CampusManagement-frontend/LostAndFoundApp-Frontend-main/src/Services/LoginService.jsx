import axios from "axios";

const BASE_URL = "http://localhost:9999/lost-found";

export const registerNewUser = (user) => axios.post(`${BASE_URL}/register`, user);

export const validateUser = (userId, password) => {
  const params = new URLSearchParams();
  params.append('username', userId);
  params.append('password', password);
  return axios.post(`${BASE_URL}/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const getUserDetails = () => axios.get(`${BASE_URL}/user/details`);

export const getAllStudents = () => axios.get(`${BASE_URL}/admin/students`);

export const deleteStudentByUsername = (username) =>
  axios.delete(`${BASE_URL}/admin/student/${username}`);

export const logoutUser = () => axios.post(`${BASE_URL}/logout`);