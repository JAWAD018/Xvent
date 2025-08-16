import React from "react";

const Header = () => (
  <header className="bg-white p-4 flex justify-between items-center fixed top-0 w-full z-10">
    <h1 className="text-orange-500 text-2xl">Xvent</h1>
    <div className="flex items-center space-x-4">
      <select className="border p-1">
        <option>Hyderabad</option>
      </select>
      <input
        type="search"
        placeholder="Search..."
        className="border p-1 w-64"
      />
      <span>☀️ 🔔 👤</span>
    </div>
  </header>
);

export default Header;
