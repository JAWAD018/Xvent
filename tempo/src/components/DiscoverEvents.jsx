
import React from "react";
import axios from "axios";
import EventCard from "./EventCard";
import CreateEvent from "./CreateEvent";

const DiscoverEvents = () => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/events/search")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([
        { _id: '1', title: 'Sample Event', date: new Date().toISOString(), venue: 'Hyderabad', banner: '', description: 'This is a sample event.', category: 'Music' },
      ]));
  }, []);

  return (
    <div className="mt-16 p-4">
      <h2 className="text-2xl font-bold mb-4">Discover Events</h2>
      <CreateEvent />
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default DiscoverEvents;
