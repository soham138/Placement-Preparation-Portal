import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          email,
          password
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.data;

      localStorage.setItem("token", token);

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (
    <div>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}