'use client';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa';

export default function BookingSummary({ booking, onBack, onProceed }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between border-b border-white/10 pb-3">
        <span className="text-gray-400">Event</span>
        <span className="font-semibold">{booking.eventName}</span>
      </div>
      
      <div className="flex justify-between border-b border-white/10 pb-3">
        <span className="text-gray-400">Venue</span>
        <span>{booking.venue}</span>
      </div>
      
      <div className="flex justify-between border-b border-white/10 pb-3">
        <span className="text-gray-400">Date & Time</span>
        <span>{booking.date} at {booking.time}</span>
      </div>
      
      <div className="flex justify-between border-b border-white/10 pb-3">
        <span className="text-gray-400">Tickets</span>
        <span>{booking.tickets}</span>
      </div>
      
      <div className="flex justify-between border-b border-white/10 pb-3">
        <span className="text-gray-400">Price per ticket</span>
        <span>${booking.price}</span>
      </div>

      {booking.specialRequests && (
        <div className="flex justify-between border-b border-white/10 pb-3">
          <span className="text-gray-400">Special Requests</span>
          <span className="text-sm text-gray-300">{booking.specialRequests}</span>
        </div>
      )}
      
      <div className="flex justify-between text-xl font-bold pt-2">
        <span>Total Amount</span>
        <span className="text-primary">${booking.totalAmount}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button 
          onClick={onBack} 
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <FaArrowLeft className="text-sm" />
          Back
        </button>
        <button 
          onClick={onProceed} 
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <FaCreditCard />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}