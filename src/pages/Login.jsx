import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      navigate("/");
    } else {
      alert("Username dan password wajib diisi");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Login</h1>

      <p className="text-gray-500 mb-8">
        Masuk ke sistem pendataan gudang dan kasir.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-200 p-4 rounded-xl mb-4 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 p-4 rounded-xl mb-6 outline-none focus:border-blue-500"
        />

        <button className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
}

export default Login;
