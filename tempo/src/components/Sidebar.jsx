import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Sidebar = () => (
  <div className="w-1/5 bg-gray-100 p-4 fixed left-0 top-0 h-full flex flex-col justify-between">
    <div>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="flex items-center">
            <span className="mr-2">🏠</span>Home
          </Link>
        </li>
        <li>
          <Link to="/discover" className="flex items-center">
            <span className="mr-2">🔍</span>Discover Events
          </Link>
        </li>
        <li>
          <Link to="/bookmarks" className="flex items-center">
            <span className="mr-2">🔖</span>Bookmarks
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex items-center">
            <span className="mr-2">👤</span>Profile
          </Link>
        </li>
        <li>
          <Link to="/help" className="flex items-center">
            <span className="mr-2">❓</span>Help
          </Link>
        </li>
        <li>
          <Link to="/settings" className="flex items-center">
            <span className="mr-2">⚙️</span>Settings
          </Link>
        </li>
      </ul>
    </div>
    <LogoutButton />
  </div>
);

export default Sidebar;
