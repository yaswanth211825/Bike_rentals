import axios from "axios";
import { message } from "antd";
const API = axios.create({
  baseURL: "https://bikezzz.onrender.com/api",
});

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await API.post("/users/login", reqObj);
    localStorage.setItem("user", JSON.stringify(response.data));
    message.success("Login Successful");
    dispatch({ type: "LOADING", payload: false });
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } catch (err) {
    console.log(err);
    message.error("Invalid Credentials");
    dispatch({ type: "LOADING", payload: false });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await API.post("/users/register", reqObj);
    message.success("Registered sucessfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);

    dispatch({ type: "LOADING", payload: false });
  } catch (err) {
    console.log(err);
    message.error("Registration failed");
    dispatch({ type: "LOADING", payload: false });
  }
};