import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "user" && password === "1234") {
      setError("");
      alert("Login Successful!");
      navigate('/addresume')
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <label className="block text-gray-700 font-medium mb-1">
          Username
        </label>
        <input
          type="text"
          placeholder="enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 mb-2"
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                     py-2 rounded-lg transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
