import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RadioGroup } from "@/components/ui/radio-group";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      enqueueSnackbar("Passwords do not match!", {variant:"error"})
      setLoading(false);
      return;
    }

    if (!role) {
      setError("Please select a role.");
      enqueueSnackbar("Please select a role", {variant:"warning"})
      setLoading(false);
      return;
    }

    try {
      const { error } = await axios.post(
        `${API_BASE_URL}/api/users/signup`, // Change URL as needed
        { name, email, password, role }
      );

      if (error) throw error;
      enqueueSnackbar("Signup successful! Check your email to verify your account.", {variant:"success"})
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
      enqueueSnackbar(err.response?.data?.error || "Signup failed", {variant:"error"})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-gray-500 text-center mt-1">
          Create your Petverse account
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2 text-center">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSignup} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Role</label>
            <RadioGroup
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              className="flex gap-4 w-full my-2"
            >
              <label
                htmlFor="buyer"
                className={`px-6 py-2 rounded-lg border cursor-pointer flex-1 text-center ${
                  role === "buyer" ? "bg-blue-700 text-white" : "bg-gray-200"
                }`}
              >
                Buyer
                <input
                  type="radio"
                  id="buyer"
                  name="role"
                  value="buyer"
                  className="hidden"
                />
              </label>

              <label
                htmlFor="seller"
                className={`px-6 py-2 rounded-lg border cursor-pointer flex-1 text-center ${
                  role === "seller" ? "bg-blue-700 text-white" : "bg-gray-200"
                }`}
              >
                Seller
                <input
                  type="radio"
                  id="seller"
                  name="role"
                  value="seller"
                  className="hidden"
                />
              </label>
            </RadioGroup>
          </div>
          <Button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
