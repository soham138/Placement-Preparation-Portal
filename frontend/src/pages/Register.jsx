import { useState } from "react";
import axios from "axios";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        formData
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STUDENT"
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="STUDENT">
            STUDENT
          </option>

          <option value="ADMIN">
            ADMIN
          </option>
        </select>

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;