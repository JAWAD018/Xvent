import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    organizer: "",
    category: "",
    type: "In-Person",
    tags: "",
    registrationLink: "",
    banner: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, banner: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "banner" && formData[key]) {
        data.append("banner", formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });
    axios
      .post("/api/events", data, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => alert("Event Created!"))
      .catch((err) => alert("Error creating event"));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg mb-4 shadow md:w-1/2 relative left-1/4">
      <input name="title" placeholder="Event Title" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <input name="date" type="date" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <input name="time" type="time" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <input name="venue" placeholder="Venue" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <input name="organizer" placeholder="Organizer" onChange={handleChange} className="w-full border p-2 mb-2" required />
      <select name="category" onChange={handleChange} className="w-full border p-2 mb-2">
        <option>Music</option>
        <option>Tech</option>
        <option>Business</option>
      </select>
      <select name="type" onChange={handleChange} className="w-full border p-2 mb-2">
        <option>In-Person</option>
        <option>Online</option>
        <option>Hybrid</option>
      </select>
      <input name="tags" placeholder="Tags (optional)" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input name="registrationLink" placeholder="Link for Registration" onChange={handleChange} className="w-full border p-2 mb-2" />
      <input type="file" onChange={handleFileChange} accept="image/*" className="mb-2" />
      <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Publish Event</button>
    </form>
  );
};

export default CreateEvent;
