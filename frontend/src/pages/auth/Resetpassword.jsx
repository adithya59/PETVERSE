import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "@/config.js";

const ResetPassword = () => {
  const { resetToken } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
        resetToken,
        password,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        <p className="text-center text-gray-500 mb-4">Enter your new password below.</p>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;