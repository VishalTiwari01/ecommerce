// import axios from "axios";
// import { signIn } from "../redux/slices/authSlice";

// export const BASE_URL =  'https://monkfish-app-phfed.ondigitalocean.app/api';

// export const loginUser = async (mobile, dispatch) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/users/login`, {
//       phoneNumber: mobile,
//     });

//     const userData = response.data;

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", userData.accessToken);

//     dispatch(signIn({ user: userData, token: userData.accessToken }));

//     return userData;
//   } catch (error) {
//     const errorMsg =
//       error.response?.data?.message || "Login failed. Please try again.";
//     throw new Error(errorMsg);
//   }
// };

// export const getAllProducts = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/products`);
//     return response.data; // Assuming the response returns an array of products
//   } catch (error) {
//     const errorMsg =
//       error.response?.data?.message || "Failed to fetch products. Please try again.";
//     throw new Error(errorMsg);
//   }
// };
// export const getProductsId = async (id) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/products/${id}`);
//     return response.data; // Assuming the response returns an array of products
//   } catch (error) {
//     const errorMsg =
//       error.response?.data?.message || "Failed to fetch products. Please try again.";
//     throw new Error(errorMsg);
//   }
// };


// export const getUserOrders = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await axios.get(`${BASE_URL}/orders`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data; 
//   } catch (error) {
//     const errorMsg =
//       error.response?.data?.message || "Failed to fetch user orders.";
//     throw new Error(errorMsg);
//   }
// };



import axios from "axios";
import { signIn } from "../redux/slices/authSlice";

// Base URL for the API endpoints
export const BASE_URL = 'https://monkfish-app-phfed.ondigitalocean.app/api';

/**
 * Handles user login using a phone number.
 * @param {string} mobile The user's phone number.
 * @param {function} dispatch Redux dispatch function to update auth state.
 * @returns {Promise<object>} The user data on successful login.
 */
export const loginUser = async (mobile, dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      phoneNumber: mobile,
    });

    const userData = response.data;

    // Persist user data and token in local storage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.accessToken);

    // Update Redux state
    dispatch(signIn({ user: userData, token: userData.accessToken }));

    return userData;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(errorMsg);
  }
};

/**
 * Fetches a list of all products.
 * @returns {Promise<Array<object>>} An array of product objects.
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data; 
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch products. Please try again.";
    throw new Error(errorMsg);
  }
};

/**
 * Fetches a single product by its ID.
 * @param {string} id The ID of the product to fetch.
 * @returns {Promise<object>} The product object.
 */
export const getProductsId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data; 
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch product details.";
    throw new Error(errorMsg);
  }
};

/**
 * Fetches all orders belonging to the currently authenticated user.
 * @returns {Promise<Array<object>>} An array of user order objects.
 */
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    // Ensure the user is logged in
    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch user orders.";
    throw new Error(errorMsg);
  }
};

/**
 * Creates a new order for the authenticated user.
 * @param {object} orderData The data required to create the order (e.g., items, shipping address, total).
 * @returns {Promise<object>} The newly created order object from the server.
 */
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    
    // Safety check: ensure token exists before making an authenticated request
    if (!token) {
        throw new Error("Authentication token not found. Please log in to place an order.");
    }

    const response = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Returns the complete order object
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to create order. Please check your cart and try again.";
    throw new Error(errorMsg);
  }
};
