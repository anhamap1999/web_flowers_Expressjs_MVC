import axios from "axios";
import Auth from './Auth/index';

let config = {
  baseURL: "http://localhost:27017",
  headers: {
    "Content-type": "application/json",
    "Authorization": ""
  }
}

if (Auth.user_token) {
  config.headers.Authorization = "Bearer " + Auth.getToken();
}

export default axios.create(config);