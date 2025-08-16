import React from "react";

const EventCard = ({ event }) => (
  <div className="bg-white p-4 rounded shadow mb-4">
    <p className="font-semibold text-lg">{event.title}</p>
    {event.banner && <img src={event.banner} alt="Event" className="w-full mt-2" />}
    <p className="text-xs text-gray-500 mt-1">{new Date(event.date).toLocaleString()}</p>
    <p>{event.description}</p>
    <p className="text-xs text-gray-400">Venue: {event.venue}</p>
    <p className="text-xs text-gray-400">Category: {event.category}</p>
  </div>
);

export default EventCard;
