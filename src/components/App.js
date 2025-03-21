import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const localizer = momentLocalizer(moment);

const EventTracker = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState("");

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowPopup(true);
  };

  const addEvent = () => {
    if (eventTitle) {
      setEvents([...events, { title: eventTitle, start: selectedDate, end: selectedDate }]);
      setShowPopup(false);
      setEventTitle("");
    }
  };

  const filterEvents = (type) => {
    const now = new Date();
    switch (type) {
      case "past":
        return events.filter((event) => event.start < now);
      case "future":
        return events.filter((event) => event.start >= now);
      default:
        return events;
    }
  };

  return (
    <div>
      <h2>Event Tracker Calendar</h2>
      <div>
        <button onClick={() => setEvents(filterEvents("all"))}>All</button>
        <button onClick={() => setEvents(filterEvents("past"))}>Past</button>
        <button onClick={() => setEvents(filterEvents("future"))}>Upcoming</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <Popup open={showPopup} closeOnDocumentClick onClose={() => setShowPopup(false)}>
        <div>
          <h3>Create Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <button onClick={addEvent}>Add Event</button>
        </div>
      </Popup>
    </div>
  );
};

export default EventTracker;
