import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/Authcontext";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUserName, setUserRole } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Validate the role
      const roleValidationResponse = await axios.post(
        `${API_BASE_URL}/api/users/validate_role`,
        { email, role }
      );

      if (!roleValidationResponse.data.valid) {
        setError(`No ${role} found with this email.`);
        setLoading(false);
        return;
      }

      // Proceed with login
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { email, password, role }
      );
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);

      setUserName(data.user.name);
      setUserRole(data.user.role);
      setSuccessMessage("Login successful!");
      setError("");
      if (data.user.role === "admin") {
        navigate("/dashboard");
        enqueueSnackbar("Login Successful!", {variant:"success"}) 
      } else if (data.user.role === "seller") {
        navigate("/dashboard");
        enqueueSnackbar("Login Successful!", {variant:"success"})
      } else if (data.user.role === "buyer") {
        navigate("/shop/home");
        enqueueSnackbar("Login Successful!", {variant:"success"})
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Login failed");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-sm mt-2 text-center">
            {successMessage}
          </p>
        )}

        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setRole("buyer")}
            className={`px-6 py-2 rounded-lg border cursor-pointer mx-2 ${
              role === "buyer" ? "bg-blue-700 text-white" : "bg-gray-200"
            }`}
          >
            Buyer
          </Button>
          <Button
            onClick={() => setRole("seller")}
            className={`px-6 py-2 rounded-lg border cursor-pointer mx-2 ${
              role === "seller" ? "bg-blue-700 text-white" : "bg-gray-200"
            }`}
          >
            Seller
          </Button>
          <Button
            onClick={() => setRole("admin")}
            className={`px-6 py-2 rounded-lg border cursor-pointer mx-2 ${
              role === "admin" ? "bg-blue-700 text-white" : "bg-gray-200"
            }`}
          >
            Admin
          </Button>
        </div>

        <form onSubmit={handleLogin} className="mt-6">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <Button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
