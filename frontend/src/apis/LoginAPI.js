import axios from "axios";
import { LOGIN_API } from "./apis";

export async function loginUser(username, password) {
  try {
    const response = await axios.post(LOGIN_API, {
      username,
      password,
    });

    if (!response){
      console.log("Failed login")
    }

    return response.data; 
  } catch (err) {
    const message = err.response?.data?.detail || "Đăng nhập thất bại";
    console.log(err)
    throw new Error(message);
  }
}
