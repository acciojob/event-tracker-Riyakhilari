import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "reactjs-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "reactjs-popup/dist/index.css";

const localizer = momentLocalizer(moment);

const EventTracker = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("all"); // all, past, upcoming
  const [newEvent, setNewEvent] = useState({ title: "", location: "", start: new Date() });

  useEffect(() => {
    setEvents([
      { id: 1, title: "Past Event", location: "Venue 1", start: moment().subtract(2, "days").toDate() },
      { id: 2, title: "Upcoming Event", location: "Venue 2", start: moment().add(3, "days").toDate() }
    ]);
  }, []);

  const openCreatePopup = (slotInfo) => {
    setNewEvent({ title: "", location: "", start: slotInfo.start });
    document.querySelector(".event-popup").click();
  };

  const addEvent = () => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    document.querySelector(".close-popup").click();
  };

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    document.querySelector(".edit-popup").click();
  };

  const editEvent = () => {
    setEvents(events.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev)));
    document.querySelector(".close-edit-popup").click();
  };

  const deleteEvent = () => {
    setEvents(events.filter((ev) => ev.id !== selectedEvent.id));
    document.querySelector(".close-edit-popup").click();
  };

  const getFilteredEvents = () => {
    return events.filter((event) => {
      if (filter === "past") return moment(event.start).isBefore(moment(), "day");
      if (filter === "upcoming") return moment(event.start).isSameOrAfter(moment(), "day");
      return true;
    });
  };

  return (
    <div>
      <button className="btn" onClick={() => setFilter("all")}>All Events</button>
      <button className="btn" onClick={() => setFilter("past")}>Past Events</button>
      <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming Events</button>

      <Calendar
        localizer={localizer}
        events={getFilteredEvents()}
        startAccessor="start"
        endAccessor="start"
        style={{ height: 500, margin: "20px" }}
        onSelectSlot={openCreatePopup}
        selectable
        onSelectEvent={openEditPopup}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: moment(event.start).isBefore(moment(), "day") ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)"
          }
        })}
      />

      {/* Create Event Popup */}
      <Popup trigger={<button className="event-popup" style={{ display: "none" }}></button>} modal>
        <div>
          <h2>Create Event</h2>
          <input placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <input placeholder="Event Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
          <button className="mm-popup__box__footer__right-space mm-popup__btn" onClick={addEvent}>Save</button>
          <button className="close-popup" onClick={() => document.querySelector(".event-popup").click()}>Close</button>
        </div>
      </Popup>

      {/* Edit Event Popup */}
      {selectedEvent && (
        <Popup trigger={<button className="edit-popup" style={{ display: "none" }}></button>} modal>
          <div>
            <h2>Edit Event</h2>
            <input value={selectedEvent.title} onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} />
            <button className="mm-popup__btn--info" onClick={editEvent}>Save</button>
            <button className="mm-popup__btn--danger" onClick={deleteEvent}>Delete</button>
            <button className="close-edit-popup" onClick={() => document.querySelector(".edit-popup").click()}>Close</button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default EventTracker;
