import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config.js"

// Create Context
export const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch Cart Items from Backend
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`${API_BASE_URL}/api/cart/get/${userId}`)
        .then((res) => setCart(res.data.items))
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, []);

  // Add Item to Cart
  const handleAddToCart = async (item) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("Please log in first!");

      const res = await axios.post(`${API_BASE_URL}/api/cart/add`, {
        userId,
        ...item,
      });

      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to add item");
      }

      setCart(res.data?.cart?.items || []); // Handle missing data safely
    } catch (error) {
      throw error.response?.data?.message || error.message || "An unknown error occurred";
    }
  };

  // Remove Item from Cart
  const handleRemoveFromCart = async (itemId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("Please log in first!");

      const res = await axios.delete(
        `${API_BASE_URL}/api/cart/${userId}/${itemId}`,
        {
          userId,
          itemId,
        }
      );

      setCart(res.data.cart.items); // Update cart state
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("Please log in first!");

      const res = await axios.post(`${API_BASE_URL}/api/cart/update`, {
        userId,
        itemId,
        quantity: newQuantity,
      });

      setCart(res.data.cart.items); // Update cart state
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to Use Cart Context
export const useCart = () => {
  return useContext(CartContext);
};
