export default function BookingCard({ booking }) {
  return (
    <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-xl font-semibold">{booking.eventName}</h3>
        <p className="text-gray-400 text-sm">{booking.date} at {booking.time}</p>
        <p className="text-sm">Tickets: {booking.tickets} | Total: ${booking.totalAmount}</p>
        <p className="text-sm text-green-400">{booking.status}</p>
      </div>
      <div className="flex gap-3">
        <img src={booking.qrCode} alt="QR" className="w-12 h-12" />
        <button className="btn-secondary text-sm">View Ticket</button>
      </div>
    </div>
  );
}