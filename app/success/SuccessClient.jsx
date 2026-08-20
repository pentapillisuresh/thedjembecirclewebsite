'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaCheckCircle, FaTimesCircle, FaTicketAlt, FaDownload,
  FaHome, FaCalendar, FaClock, FaMapMarkerAlt, FaUser,
  FaPhone, FaEnvelope, FaWallet, FaArrowRight, FaPrint,
  FaSpinner, FaFilePdf
} from 'react-icons/fa';
import ApiService from '@/services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketRef = useRef(null);
  const orderId = searchParams.get('orderId');
  const eventId = searchParams.get('eventId');
  const tickets = searchParams.get('tickets');
  const paymentId = searchParams.get('payment_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    if (paymentId) {
      setIsSuccess(true);
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getOrder(orderId);
        if (data.success && data.data) {
          setOrder(data.data);
          if (data.data.status === 'confirmed' || data.data.status === 'completed') {
            setIsSuccess(true);
          }
        } else {
          setError(data.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError('Could not load order details');
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, paymentId, router]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const generateBookingId = () => {
    if (!order) return 'TJC000000000';
    const date = new Date(order.event?.date || Date.now());
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TJC${year}${month}${day}${random}`;
  };

  // ------------------- FULL PDF GENERATION (FIXED) -------------------
  const downloadTicketPDF = async () => {
    if (!order) {
      toast.error('Order data not available');
      return;
    }

    setDownloading(true);

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
      const bookingId = generateBookingId();
      const totalTickets = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || parseInt(tickets) || 1;
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
      const paymentIdValue = order.razorpayPaymentId || paymentId || 'N/A';

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
      const ticketW = 272;
      const ticketH = 152;
      const leftW = 65;
      const middleW = 135;
      const rightW = ticketW - leftW - middleW;
      const leftX = ticketX;
      const leftY = ticketY;      // ✅ FIX: define leftY
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
      pdf.text(isSuccess ? 'CONFIRMED' : 'FAILED', statusX, customerY + 14);

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
      setDownloading(false);
    }
  };

  const printTicket = () => {
    window.print();
  };

  // -------- Loading / Error / Render (unchanged) --------
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order not found</h2>
          <p className="text-gray-400 mb-6">{error || 'We couldn\'t find your booking details.'}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/30 group"
          >
            <span>Go Home</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    );
  }

  const statusBg = isSuccess ? 'bg-green-500/10' : 'bg-red-500/10';
  const statusBorder = isSuccess ? 'border-green-500' : 'border-red-500';
  const StatusIcon = isSuccess ? FaCheckCircle : FaTimesCircle;
  const statusTitle = isSuccess ? 'Booking Confirmed!' : 'Payment Failed';
  const statusMessage = isSuccess
    ? 'Your spot is secured. We can\'t wait to see you there!'
    : 'We couldn\'t process your payment. Please try again.';
  const headerColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';

  const totalTickets = order.items?.reduce((sum, item) => sum + item.quantity, 0) || parseInt(tickets) || 0;
  const bookingId = generateBookingId();

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-16 px-4">
      <div className={`absolute top-0 right-0 w-96 h-96 ${isSuccess ? 'bg-green-500/5' : 'bg-red-500/5'} blur-3xl`}></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center ${statusBg} backdrop-blur-md px-6 py-2 mb-4 border-l-4 ${borderColor}`}>
            <StatusIcon className={`${headerColor} mr-2`} />
            <span className={`${headerColor} text-sm font-semibold tracking-wider`}>
              {isSuccess ? 'SUCCESS' : 'FAILED'}
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold text-white`}>
            {statusTitle}
          </h1>
          <div className={`w-24 h-1 ${borderColor} mx-auto mt-4`}></div>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {statusMessage}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 ${statusBg} rounded-full flex items-center justify-center border-2 ${borderColor}`}>
                  <StatusIcon className={`text-5xl ${headerColor}`} />
                </div>
              </div>

              <h2 className={`text-2xl font-bold text-white text-center mb-6 ${headerColor}`}>
                {statusTitle}
              </h2>

              <div className="border border-white/10 bg-white/5 p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider text-center">Booking ID</p>
                <p className="text-xl font-mono text-primary text-center">{bookingId}</p>
                {order.razorpayPaymentId && (
                  <p className="text-xs text-gray-500 text-center mt-1">Payment ID: {order.razorpayPaymentId}</p>
                )}
                {paymentId && !order.razorpayPaymentId && (
                  <p className="text-xs text-gray-500 text-center mt-1">Payment ID: {paymentId}</p>
                )}
              </div>

              {order.event && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white mb-3">Event Details</h3>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaTicketAlt className="text-primary" />
                      Event
                    </span>
                    <span className="text-white font-semibold">{order.event.title}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      Venue
                    </span>
                    <span className="text-white">{order.event.venue || 'TBD'}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaCalendar className="text-primary" />
                      Date
                    </span>
                    <span className="text-white">{formatDate(order.event.date)}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaClock className="text-primary" />
                      Time
                    </span>
                    <span className="text-white">{formatTime(order.event.date)}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaTicketAlt className="text-primary" />
                      Tickets
                    </span>
                    <span className="text-white font-semibold">
                      {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs bg-white/5 px-2 py-1 border border-white/10 text-gray-300"
                        >
                          {item.ticketClass?.name || 'Class'} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaWallet className="text-primary" />
                      Total Paid
                    </span>
                    <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
                  </div>
                </div>
              )}

              {order.User && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Customer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaUser className="text-primary" />
                      <span>{order.User.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaPhone className="text-primary" />
                      <span>{order.User.phone}</span>
                    </div>
                    {order.User.email && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaEnvelope className="text-primary" />
                        <span>{order.User.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

              {isSuccess ? (
                <>
                  <div className="space-y-3">
                    <button 
                      onClick={downloadTicketPDF}
                      disabled={downloading}
                      className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <FaFilePdf className="mr-2" />
                          Download PDF Ticket
                        </>
                      )}
                    </button>

                    <button 
                      onClick={printTicket}
                      className="w-full flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group"
                    >
                      <FaPrint className="mr-2" />
                      Print Ticket
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                    <Link
                      href="/events"
                      className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-white font-semibold hover:border-primary/50 transition-all duration-300 group"
                    >
                      <FaTicketAlt className="mr-2" />
                      Browse More Events
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/booking"
                    className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold hover:bg-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 group"
                  >
                    <FaTicketAlt className="mr-2" />
                    Try Again
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-6 py-3 border border-white/10 text-gray-400 font-semibold hover:text-white hover:border-white/30 transition-all duration-300 group"
                  >
                    Contact Support
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center px-6 py-3 text-gray-400 font-semibold hover:text-white transition-all duration-300 group"
                >
                  <FaHome className="mr-2" />
                  Go Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}