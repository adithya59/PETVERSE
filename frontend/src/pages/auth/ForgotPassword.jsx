import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/config.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/forgotpassword`, { email });
      setMessage(data.message);
    } catch (err) {
      setError("Error sending password reset link.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-4">
          Enter your email to receive reset instructions.
        </p>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
