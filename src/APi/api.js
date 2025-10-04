import axios from "axios";
import { signIn } from "../redux/slices/authSlice";

export const BASE_URL =  'https://monkfish-app-phfed.ondigitalocean.app/api';

export const loginUser = async (mobile, dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      phoneNumber: mobile,
    });

    const userData = response.data;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.accessToken);

    dispatch(signIn({ user: userData, token: userData.accessToken }));

    return userData;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(errorMsg);
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data; // Assuming the response returns an array of products
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch products. Please try again.";
    throw new Error(errorMsg);
  }
};
export const getProductsId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data; // Assuming the response returns an array of products
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch products. Please try again.";
    throw new Error(errorMsg);
  }
};


export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Expecting array of orders
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch user orders.";
    throw new Error(errorMsg);
  }
};