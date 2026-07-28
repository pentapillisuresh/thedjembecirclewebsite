'use client';
import { useState, useEffect } from 'react';
import { getEvents } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export default function BookingForm({ onSubmit, initialData = {} }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    tickets: 1,
    specialRequests: '',
    ...initialData
  });

  useEffect(() => {
    const eventList = getEvents();
    setEvents(eventList);
    if (eventList.length > 0 && !formData.eventId) {
      setFormData(prev => ({ ...prev, eventId: eventList[0].id }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEvent = events.find(e => e.id === formData.eventId);
    if (selectedEvent) {
      onSubmit({
        ...formData,
        eventName: selectedEvent.name,
        venue: selectedEvent.venue,
        date: selectedEvent.date,
        time: selectedEvent.time,
        price: selectedEvent.price,
        totalAmount: selectedEvent.price * Number(formData.tickets)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Select Event
        </label>
        <select
          name="eventId"
          value={formData.eventId}
          onChange={handleChange}
          className="input-dark"
          required
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} - ${event.price} ({event.date})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="input-dark"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="input-dark"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-dark"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Number of Tickets
        </label>
        <input
          type="number"
          name="tickets"
          min="1"
          max="10"
          value={formData.tickets}
          onChange={handleChange}
          className="input-dark"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Special Requests (Optional)
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          className="input-dark"
          rows="3"
          placeholder="Any special requirements or requests?"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Continue to Summary
      </button>
    </form>
  );
}