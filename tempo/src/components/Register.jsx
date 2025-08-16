import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/auth/register", formData)
      // .post("http://localhost:5000/api/auth/register", formData)
      .then((res) => {
        // Redirect to login
        console.log(res);
        window.location.href = "/login";
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 p-4 max-w-md mx-auto bg-white shadow rounded"
    >
      <input
        name="name"
        placeholder="name"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Register;