import React from "react";

const Rightbar = () => (
  <div className="w-1/5 bg-gray-100 p-4 fixed right-0 top-0 h-full">
    <h3 className="font-bold">Top Events</h3>
    <ul className="space-y-2">
      <li>Music Bash #music</li>
      <li>Design Expo #arts</li>
      <li>Tech Summit #technology</li>
    </ul>
    <h3 className="font-bold mt-4">New Events</h3>
    <ul className="space-y-2">
      <li>Released a new version. 59 minutes ago</li>
    </ul>
    <h3 className="font-bold mt-4">This Week</h3>
    <ul className="space-y-2">
      <li>Music Bash - 3 days left</li>
    </ul>
  </div>
);

export default Rightbar;
