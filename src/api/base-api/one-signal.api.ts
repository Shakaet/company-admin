import axios from "axios";

const oneSignalApi = axios.create({
  baseURL: "https://onesignal.com/api/v1",
});

oneSignalApi.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

export default oneSignalApi;
