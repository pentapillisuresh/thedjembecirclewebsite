import React from "react";

export default function RefundCancellationPolicy() {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden py-16 px-4">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FD9A00]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FD9A00]/5 blur-3xl rounded-full"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-[#111111] border border-gray-800 rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Refund & Cancellation Policy
          </h1>

          <p className="text-center text-gray-400 mb-10">
            <strong>Last Updated:</strong> July 29, 2026
          </p>

          {/* Introduction */}
          <div className="space-y-5 text-gray-300 leading-8">
            <p>
              Welcome to <strong>The Djembe Circle</strong>, operated by{" "}
              <strong>WURQ PROJECTS PRIVATE LIMITED</strong>.
            </p>

            <p>
              We are committed to providing a smooth and transparent booking
              experience for all drum circle events, workshops, corporate
              programs, school events, private celebrations, and community
              experiences.
            </p>

            <p>
              By booking an event through our website, you agree to the Refund &
              Cancellation Policy outlined below.
            </p>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Booking Confirmation */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              1. Booking Confirmation
            </h2>

            <p className="text-gray-300 leading-8">
              Your booking is confirmed only after:
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>Successful payment through Razorpay.</li>
              <li>Confirmation email or SMS is sent by our team.</li>
              <li>The selected event date and slot are available.</li>
            </ul>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Cancellation */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              2. Customer Cancellation
            </h2>

            <p className="text-gray-300 leading-8">
              Customers may request cancellation by contacting our support team
              before the scheduled event.
            </p>

            <p className="text-gray-300 mt-4">
              Please include the following details:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-300">
              <li>Booking ID</li>
              <li>Registered Name</li>
              <li>Mobile Number</li>
              <li>Reason for Cancellation</li>
            </ul>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Refund Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              3. Refund Eligibility
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-700">
              <table className="w-full">
                <thead className="bg-[#1b1b1b]">
                  <tr>
                    <th className="text-left p-4 border-b border-gray-700">
                      Cancellation Time
                    </th>
                    <th className="text-left p-4 border-b border-gray-700">
                      Refund
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="p-4">
                      More than 7 days before the event
                    </td>
                    <td className="p-4 text-green-400">100% Refund</td>
                  </tr>

                  <tr className="border-b border-gray-700">
                    <td className="p-4">3–7 days before the event</td>
                    <td className="p-4 text-yellow-400">75% Refund</td>
                  </tr>

                  <tr className="border-b border-gray-700">
                    <td className="p-4">Less than 72 hours before the event</td>
                    <td className="p-4 text-orange-400">50% Refund</td>
                  </tr>

                  <tr className="border-b border-gray-700">
                    <td className="p-4">After the event has started</td>
                    <td className="p-4 text-red-400">No Refund</td>
                  </tr>

                  <tr>
                    <td className="p-4">No Show</td>
                    <td className="p-4 text-blue-400">
                      Eligible for one-time rescheduling or event credit within
                      90 days (subject to availability). No cash refund.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Rescheduling */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              4. Event Rescheduling
            </h2>

            <p className="text-gray-300 leading-8">
              If you are unable to attend your booked event, you may request
              rescheduling.
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>
                Requests should preferably be made at least 24 hours before the
                event.
              </li>
              <li>Rescheduling is subject to seat availability.</li>
              <li>Only one complimentary reschedule is allowed per booking.</li>
              <li>
                Rescheduled bookings cannot be converted into cash refunds.
              </li>
            </ul>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Event Cancellation */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              5. Event Cancellation by The Djembe Circle
            </h2>

            <p className="text-gray-300 leading-8">
              If an event is cancelled by The Djembe Circle due to operational
              reasons, weather conditions, government restrictions, safety
              concerns, or any unforeseen circumstances, customers may choose
              one of the following:
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>100% refund to the original payment method.</li>
              <li>Reschedule to another available event.</li>
              <li>Receive an event credit for future bookings.</li>
            </ul>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Refund Processing */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              6. Refund Processing Time
            </h2>

            <p className="text-gray-300 leading-8">
              Approved refunds will be processed within{" "}
              <strong>7–10 business days</strong> to the original payment
              method.
            </p>

            <p className="text-gray-300 mt-4">
              Processing time may vary depending on your bank, UPI provider, or
              card issuer.
            </p>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Duplicate Payments */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              7. Duplicate Payments
            </h2>

            <p className="text-gray-300 leading-8">
              If multiple payments are made for the same booking because of a
              technical issue, the additional amount will be refunded after
              verification.
            </p>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Failed Transactions */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              8. Failed Transactions
            </h2>

            <p className="text-gray-300 leading-8">
              If your payment fails but the amount is debited from your account,
              please allow up to 24 hours for the payment gateway or bank to
              automatically reverse the transaction.
            </p>

            <p className="text-gray-300 mt-4">
              If the amount is not reversed, please contact our support team
              with your transaction details.
            </p>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Force Majeure */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              9. Force Majeure
            </h2>

            <p className="text-gray-300 leading-8">
              The Djembe Circle shall not be held responsible for cancellations
              or delays caused by events beyond our reasonable control,
              including but not limited to natural disasters, pandemics,
              government restrictions, civil unrest, power failures, internet
              outages, or other force majeure events.
            </p>
          </div>

          <hr className="my-10 border-gray-700" />

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              10. Contact Information
            </h2>

            <div className="rounded-xl border border-gray-700 bg-[#0d0d0d] p-6 space-y-4 text-gray-300">
              <p>
                <strong>Company Name:</strong> WURQ PROJECTS PRIVATE LIMITED
              </p>

              <p>
                <strong>Brand:</strong> The Djembe Circle
              </p>

              <p>
                <strong>Address:</strong>
                <br />
                Flat No. 401,
                <br />
                16-10-30/1,
                <br />
                Ajay Vihar,
                <br />
                Old Malakpet,
                <br />
                Hyderabad,
                <br />
                Telangana - 500036,
                <br />
                India
              </p>

              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:thedjembecircle2018@gmail.com"
                  className="text-[#FD9A00] hover:underline"
                >
                  thedjembecircle2018@gmail.com
                </a>
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+918520988496"
                  className="text-[#FD9A00] hover:underline"
                >
                  +91 85209 88496
                </a>
              </p>

              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://thedjembecircle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FD9A00] hover:underline"
                >
                  https://thedjembecircle.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} WURQ PROJECTS PRIVATE LIMITED. All
            Rights Reserved.
          </div>
        </div>
      </div>
    </section>
  );
}