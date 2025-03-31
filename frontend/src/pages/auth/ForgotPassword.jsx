import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/config.js"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email });
      setMessage(data.message);
    } catch (err) {
      setMessage("Error sending password reset link.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
        <p className="text-center text-gray-500 mt-2">Enter your email to receive reset instructions.</p>

        {message && <p className="text-green-500 text-center mt-4">{message}</p>}

        <form onSubmit={handleReset} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
