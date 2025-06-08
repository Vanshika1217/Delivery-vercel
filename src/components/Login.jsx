import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful!");

        const { username, token, email, role } = response.data;

        // ✅ Store in localStorage
        localStorage.setItem("user", JSON.stringify({ username, token, email, role }));

        // Redirect based on role
        role === "admin" ? navigate("/admin") : navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-green-200 to-green-300">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4"></h2>
        <p className="text-gray-600 text-center text-sm mb-6">Welcome back! Log in to continue.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-md"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
