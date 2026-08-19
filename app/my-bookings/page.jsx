'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaTicketAlt,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaQrcode,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaClockIcon,
  FaSpinner,
  FaFilePdf,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getUserOrders();
        if (data.success && data.data) {
          setBookings(data.data.orders || []);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        console.error('Fetch bookings error:', err);
        setError('Could not load your bookings');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const generateBookingId = (order) => {
    if (!order) return 'TJC000000000';
    const date = order.event?.date ? new Date(order.event.date) : new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TJC${year}${month}${day}${random}`;
  };

 const downloadTicketPDF = async (order) => {
  if (!order) {
    toast.error('Order data not available');
    return;
  }

  setDownloadingId(order.id);

  try {
    const QRCode = (await import('qrcode')).default;
    const JsBarcode = (await import('jsbarcode')).default;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [280, 160],
      compress: true,
    });

    // DATA
    const bookingId = generateBookingId(order);
    const totalTickets = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 1;
    const ticketClass = order.items?.[0]?.ticketClass?.name || 'General Admission';
    const ticketPrice = Number(order.items?.[0]?.ticketClass?.price) || Number(order.totalAmount || 0) / totalTickets || 0;
    const totalAmount = Number(order.totalAmount || ticketPrice * totalTickets);
    const eventTitle = order.event?.title || 'THE DJEMBE CIRCLE';
    const eventDescription = order.event?.description || 'DRUM CIRCLE EXPERIENCE';
    const eventDate = order.event?.date;
    const eventDateWithDay = formatDateWithDay(eventDate);
    const shortDate = formatDateShort(eventDate);
    const eventTime = formatTime(eventDate);
    const venue = order.event?.venue || 'TJC Community Center, Bangalore, Karnataka';
    const customerName = order.User?.name || 'N/A';
    const customerPhone = order.User?.phone || 'N/A';
    const paymentIdValue = order.razorpayPaymentId || 'N/A';

    const RED = [216, 39, 46];
    const DARK_RED = [190, 25, 35];
    const BLACK = [15, 15, 15];
    const DARK_GRAY = [70, 70, 70];
    const GRAY = [110, 110, 110];
    const LIGHT_GRAY = [220, 220, 220];
    const GREEN = [25, 145, 65];
    const WHITE = [255, 255, 255];

    // TICKET DIMENSIONS
    const ticketX = 4;
    const ticketY = 4;
    const leftY = ticketY; // <-- Add this line
    const ticketW = 272;
    const ticketH = 152;
    const leftW = 65;
    const middleW = 135;
    const rightW = ticketW - leftW - middleW;
    const leftX = ticketX;
    const middleX = leftX + leftW;
    const rightX = middleX + middleW;

    // BACKGROUND
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, 280, 160, 'F');

    // MAIN WHITE TICKET
    pdf.setFillColor(...WHITE);
    pdf.roundedRect(ticketX, ticketY, ticketW, ticketH, 5, 5, 'F');

    // LEFT IMAGE PANEL
    try {
      const imageData = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = '/images/ticket-left-panel.png';
      });
      pdf.addImage(imageData, 'PNG', leftX, leftY, leftW, ticketH, undefined, 'FAST');
    } catch (imageError) {
      pdf.setFillColor(...DARK_RED);
      pdf.rect(leftX, leftY, leftW, ticketH, 'F');
    }

    // Dark overlay
    pdf.setFillColor(0, 0, 0);
    pdf.setGState(new pdf.GState({ opacity: 0.10 }));
    pdf.rect(leftX, leftY, leftW, ticketH, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));

    // MIDDLE SECTION
    const contentX = middleX + 8;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.text('EVENT', contentX, ticketY + 14);

    pdf.setFontSize(16);
    pdf.setTextColor(...BLACK);
    pdf.text(eventTitle.toUpperCase(), contentX, ticketY + 27);

    pdf.setFontSize(8);
    pdf.setTextColor(...DARK_GRAY);
    pdf.text(eventDescription.toUpperCase(), contentX, ticketY + 36);

    // EVENT INFORMATION
    const infoY = ticketY + 50;

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATE', contentX + 8, infoY);
    pdf.setFontSize(9);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(eventDateWithDay, contentX + 8, infoY + 8);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TIME', contentX + 8, infoY + 20);
    pdf.setFontSize(9);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${eventTime} Onwards`, contentX + 8, infoY + 28);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VENUE', contentX + 8, infoY + 40);
    pdf.setFontSize(7);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    const venueLines = pdf.splitTextToSize(venue, 50);
    pdf.text(venueLines, contentX + 8, infoY + 48);

    // VERTICAL DIVIDER
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.setLineWidth(0.3);
    pdf.line(middleX + 72, infoY - 2, middleX + 72, infoY + 52);

    // BOOKING ID
    const rightInfoX = middleX + 78;
    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BOOKING ID', rightInfoX, infoY);
    pdf.setFontSize(8);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bookingId, rightInfoX, infoY + 8);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT ID', rightInfoX, infoY + 20);
    pdf.setFontSize(7);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    const paymentText = pdf.splitTextToSize(paymentIdValue, 45);
    pdf.text(paymentText, rightInfoX, infoY + 28);

    // TICKET DETAILS DIVIDER
    const detailsY = ticketY + 108;
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.line(contentX, detailsY, rightX - 10, detailsY);

    // TICKET TYPE - Compact row
    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TICKET TYPE', contentX, detailsY + 8);
    pdf.setFontSize(8);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(ticketClass, contentX, detailsY + 16);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('QTY', contentX + 50, detailsY + 8);
    pdf.setFontSize(8);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(totalTickets), contentX + 50, detailsY + 16);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PRICE', contentX + 75, detailsY + 8);
    pdf.setFontSize(8);
    pdf.setTextColor(...BLACK);
    pdf.text(`Rs ${ticketPrice.toFixed(2)}`, contentX + 75, detailsY + 16);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL', contentX + 105, detailsY + 8);
    pdf.setFontSize(9);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(` Rs ${totalAmount.toFixed(2)}`, contentX + 105, detailsY + 17);

    // BOOKED BY - Compact
    const customerY = detailsY + 28;
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.line(contentX, customerY - 3, rightX - 10, customerY - 3);

    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BOOKED BY', contentX, customerY + 4);
    pdf.setFontSize(8);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(customerName, contentX, customerY + 12);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(customerPhone, contentX, customerY + 19);

    // ORDER STATUS
    const statusX = contentX + 80;
    pdf.setFontSize(6);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORDER STATUS', statusX, customerY + 4);
    pdf.setFontSize(8);
    pdf.setTextColor(...GREEN);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONFIRMED', statusX, customerY + 14);

    // RIGHT TEAR-OFF AREA
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.35);
    for (let y = ticketY + 4; y < ticketY + ticketH - 4; y += 5) {
      pdf.line(rightX, y, rightX, Math.min(y + 2.5, ticketY + ticketH - 4));
    }

    // ADMIT ONE
    const admitX = rightX + 8;
    const admitW = rightW - 16;
    pdf.setFillColor(...RED);
    pdf.roundedRect(admitX, ticketY + 12, admitW, 11, 2, 2, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(...WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ADMIT ONE', admitX + admitW / 2, ticketY + 20, { align: 'center' });

    // QR CODE
    const qrData = JSON.stringify({
      bookingId,
      orderId: order.id,
      paymentId: paymentIdValue,
      eventId: order.event?.id,
      event: eventTitle,
      tickets: totalTickets,
    });

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H',
    });

    const qrSize = 35;
    pdf.addImage(qrDataUrl, 'PNG', rightX + (rightW - qrSize) / 2, ticketY + 28, qrSize, qrSize, undefined, 'FAST');

    // RIGHT EVENT DETAILS
    const stubY = ticketY + 70;
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.line(rightX + 6, stubY, ticketX + ticketW - 6, stubY);

    pdf.setFontSize(8);
    pdf.setTextColor(...RED);
    pdf.setFont('helvetica', 'bold');
    const rightTitle = pdf.splitTextToSize(eventTitle.toUpperCase(), rightW - 14);
    pdf.text(rightTitle, rightX + 8, stubY + 10);

    pdf.setFontSize(6);
    pdf.setTextColor(...GRAY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DATE', rightX + 8, stubY + 24);
    pdf.setFontSize(7);
    pdf.setTextColor(...BLACK);
    pdf.text(shortDate, rightX + 20, stubY + 24);

    pdf.setFontSize(6);
    pdf.setTextColor(...GRAY);
    pdf.text('TIME', rightX + 8, stubY + 32);
    pdf.setFontSize(7);
    pdf.setTextColor(...BLACK);
    pdf.text(eventTime, rightX + 20, stubY + 32);

    pdf.setFontSize(6);
    pdf.setTextColor(...GRAY);
    pdf.text('VENUE', rightX + 8, stubY + 40);
    pdf.setFontSize(6);
    pdf.setTextColor(...BLACK);
    const shortVenue = pdf.splitTextToSize(venue, rightW - 30);
    pdf.text(shortVenue, rightX + 22, stubY + 40);

    // BARCODE
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, bookingId, {
      format: 'CODE128',
      width: 1.8,
      height: 50,
      displayValue: false,
      margin: 0,
    });
    const barcodeData = barcodeCanvas.toDataURL('image/png');
    const barcodeW = rightW - 16;
    const barcodeH = 14;
    pdf.addImage(barcodeData, 'PNG', rightX + 8, ticketY + 130, barcodeW, barcodeH, undefined, 'FAST');

    pdf.setFontSize(7);
    pdf.setTextColor(...BLACK);
    pdf.setFont('helvetica', 'bold');
    pdf.text(bookingId, rightX + rightW / 2, ticketY + 148, { align: 'center' });

    // TICKET EDGE PERFORATIONS
    pdf.setFillColor(...WHITE);
    for (let y = ticketY + 6; y < ticketY + ticketH - 4; y += 8) {
      pdf.circle(ticketX, y, 1.5, 'F');
      pdf.circle(ticketX + ticketW, y, 1.5, 'F');
    }

    pdf.setFillColor(245, 245, 245);
    pdf.circle(rightX, ticketY, 2.5, 'F');
    pdf.circle(rightX, ticketY + ticketH, 2.5, 'F');

    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.35);
    pdf.roundedRect(ticketX, ticketY, ticketW, ticketH, 5, 5, 'S');

    pdf.save(`ticket-${bookingId}.pdf`);
    toast.success('Ticket PDF downloaded successfully!');

  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Failed to generate ticket PDF');
  } finally {
    setDownloadingId(null);
  }
};

  // Helper to format date and time
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateWithDay = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Confirmed' },
      pending: { icon: FaClockIcon, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
      failed: { icon: FaTimesCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
      refunded: { icon: FaTimesCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Refunded' },
      cancelled: { icon: FaTimesCircle, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Cancelled' },
    };
    const defaultStatus = { icon: FaClockIcon, color: 'text-gray-400', bg: 'bg-gray-400/10', label: status };
    return statusMap[status] || defaultStatus;
  };

  // Filter bookings based on event date
  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
      if (filter === 'all') return true;
      if (filter === 'upcoming') return eventDate && eventDate >= now && booking.status !== 'cancelled';
      if (filter === 'past') return eventDate && eventDate < now && booking.status !== 'cancelled';
      if (filter === 'cancelled') return booking.status === 'cancelled';
      return true;
    });
  };

  // If not logged in, show prompt
  if (!user) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your bookings</p>
          <Link href="/login" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group">
            <span>Go to Login</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const filteredBookings = getFilteredBookings();

  if (bookings.length === 0) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <FaTicketAlt className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">No Bookings Yet</h2>
          <p className="text-gray-400 mb-6">Book your first drum event today and experience the rhythm!</p>
          <Link href="/events" className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30 group">
            <span>Explore Events</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2 mb-4 border-l-4 border-primary">
            <FaTicketAlt className="text-primary mr-2" />
            <span className="text-primary text-sm font-semibold tracking-wider">MY BOOKINGS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                My <span className="text-primary">Bookings</span>
              </h1>
              <div className="w-24 h-1 bg-primary mt-4"></div>
              <p className="mt-4 text-lg text-gray-300">
                View and manage all your confirmed bookings
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{bookings.length} total bookings</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['all', 'upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                filter === tab
                  ? 'bg-primary text-white border-l-4 border-white'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-primary/30'
              }`}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => {
            const StatusIcon = getStatusBadge(booking.status).icon;
            const statusColor = getStatusBadge(booking.status).color;
            const statusBg = getStatusBadge(booking.status).bg;
            const statusLabel = getStatusBadge(booking.status).label;
            const isDownloading = downloadingId === booking.id;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Event info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {booking.event?.title || 'Event'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-primary" />
                              {formatDate(booking.event?.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-primary" />
                              {formatTime(booking.event?.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-primary" />
                              {booking.event?.venue || 'TBD'}
                            </span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 ${statusBg} border-l-2 ${statusColor}`}>
                          <StatusIcon className={statusColor} />
                          <span className={`text-sm font-medium ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Order items summary */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          Tickets: <span className="text-white font-semibold">
                            {booking.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                          </span>
                        </span>
                        <span className="text-gray-400">
                          Total: <span className="text-primary font-semibold">₹{booking.totalAmount}</span>
                        </span>
                      </div>

                      {/* Ticket classes */}
                      {booking.items && booking.items.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {booking.items.map((item) => (
                            <span
                              key={item.id}
                              className="text-xs bg-white/5 px-2 py-1 border border-white/10 text-gray-300"
                            >
                              {item.ticketClass?.name || 'Class'} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      {booking.status === 'paid' && (
                        <>
                          <button
                            onClick={() => downloadTicketPDF(booking)}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDownloading ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <FaFilePdf />
                                Download PDF
                              </>
                            )}
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 border border-white/10 hover:border-primary/30 transition-all duration-300">
                            <FaPrint />
                            Print
                          </button>
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <Link
                          href={`/payment?orderId=${booking.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white hover:bg-primary/80 transition-all duration-300"
                        >
                          <FaArrowRight />
                          Pay Now
                        </Link>
                      )}
                      {booking.status === 'paid' && (
                        <Link
                          href={`/my-bookings/${booking.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm border border-white/20 text-white hover:border-primary/50 transition-all duration-300"
                        >
                          <FaTicketAlt />
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No filtered bookings */}
        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-white/10 bg-white/5"
          >
            <p className="text-gray-400">No {filter} bookings found</p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 border border-white/10 bg-white/5 backdrop-blur-sm p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact us for any assistance with your bookings</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group"
            >
              <span>Contact Support</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}