import React from "react";

export default function TermsConditions() {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden py-16 px-4">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FD9A00]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FD9A00]/5 blur-3xl rounded-full"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-[#111111] border border-gray-800 rounded-2xl shadow-xl p-6 md:p-10">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>

          <p className="text-gray-400 mb-10">
            <strong>Last Updated:</strong> July 29, 2026
          </p>

          {/* Introduction */}
          <section className="space-y-5 text-gray-300 leading-8">
            <p>
              Welcome to <strong>The Djembe Circle</strong>, owned and operated
              by <strong>WURQ PROJECTS PRIVATE LIMITED</strong>.
            </p>

            <p>
              These Terms & Conditions govern your access to and use of our
              website, products, services, workshops, drum circle experiences,
              corporate events, school programs, private events, and any other
              services offered through our website.
            </p>

            <p>
              By accessing our website or booking any service, you acknowledge
              that you have read, understood, and agreed to these Terms &
              Conditions.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Eligibility
            </h2>

            <p className="text-gray-300 leading-8">
              You must be at least 18 years of age to make a booking on our
              website. If a booking is made on behalf of a minor, it must be
              completed by a parent, guardian, school, organization, or
              authorized representative.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Our Services
            </h2>

            <p className="text-gray-300 leading-8">
              The Djembe Circle offers various interactive musical experiences,
              including but not limited to:
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>Corporate Drum Circle Events</li>
              <li>School & College Workshops</li>
              <li>Private Celebrations</li>
              <li>Community Drum Circle Sessions</li>
              <li>Wellness & Team Building Programs</li>
              <li>Special Customized Events</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Booking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Booking & Confirmation
            </h2>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li>Bookings are confirmed only after successful payment.</li>
              <li>Availability is subject to confirmation.</li>
              <li>You must provide accurate booking information.</li>
              <li>Incorrect information may result in cancellation.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Payments
            </h2>

            <p className="text-gray-300 leading-8">
              Payments are securely processed through Razorpay or other approved
              payment gateways.
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>All prices are displayed in Indian Rupees (INR).</li>
              <li>Applicable taxes may be charged where required.</li>
              <li>Payment must be completed before booking confirmation.</li>
              <li>Failed transactions do not constitute confirmed bookings.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Cancellation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Cancellation & Refunds
            </h2>

            <p className="text-gray-300 leading-8">
              Refunds and cancellations are governed by our Refund &
              Cancellation Policy available on this website.
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>Refund requests are reviewed individually.</li>
              <li>Approved refunds are processed within 7–10 business days.</li>
              <li>Rescheduling is subject to availability.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Customer Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Customer Responsibilities
            </h2>

            <p className="text-gray-300 mb-4">
              You agree to:
            </p>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li>Provide accurate personal information.</li>
              <li>Follow event safety instructions.</li>
              <li>Respect instructors, facilitators, and other participants.</li>
              <li>Not engage in unlawful or disruptive behavior.</li>
              <li>Take responsibility for your personal belongings.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>

            <p className="text-gray-300 leading-8">
              All content on this website, including text, images, graphics,
              logos, videos, audio, trademarks, designs, and software, is the
              property of WURQ PROJECTS PRIVATE LIMITED or its licensors and is
              protected by applicable intellectual property laws.
            </p>

            <p className="text-gray-300 mt-4">
              You may not copy, reproduce, distribute, modify, or use any
              content without prior written permission.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Prohibited Activities
            </h2>

            <p className="text-gray-300 mb-4">
              Users must not:
            </p>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li>Attempt unauthorized access to our systems.</li>
              <li>Upload viruses or malicious software.</li>
              <li>Use the website for fraudulent purposes.</li>
              <li>Copy or scrape website content.</li>
              <li>Interfere with website functionality.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Limitation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>

            <p className="text-gray-300 leading-8">
              WURQ PROJECTS PRIVATE LIMITED shall not be liable for any
              indirect, incidental, consequential, or special damages arising
              from the use of our website or participation in our events, except
              where liability cannot be excluded under applicable law.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Force Majeure */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Force Majeure
            </h2>

            <p className="text-gray-300 leading-8">
              We are not responsible for delays, cancellations, or failure to
              perform our obligations due to events beyond our reasonable
              control, including natural disasters, pandemics, strikes,
              government restrictions, weather conditions, or technical
              failures.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Privacy
            </h2>

            <p className="text-gray-300 leading-8">
              Your use of our website is also governed by our Privacy Policy,
              which explains how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              12. Governing Law
            </h2>

            <p className="text-gray-300 leading-8">
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India. Any disputes arising from these
              terms shall be subject to the exclusive jurisdiction of the courts
              located in Hyderabad, Telangana.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              13. Changes to Terms
            </h2>

            <p className="text-gray-300 leading-8">
              We reserve the right to modify these Terms & Conditions at any
              time. Updated versions will be posted on this page with the latest
              revision date.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              14. Contact Us
            </h2>

            <div className="bg-[#0d0d0d] border border-gray-700 rounded-xl p-6 space-y-4 text-gray-300">

              <p>
                <strong>Company Name:</strong> WURQ PROJECTS PRIVATE LIMITED
              </p>

              <p>
                <strong>Brand:</strong> The Djembe Circle
              </p>

              <p>
                <strong>Address:</strong><br />
                Flat No. 401,<br />
                16-10-30/1,<br />
                Ajay Vihar,<br />
                Old Malakpet,<br />
                Hyderabad,<br />
                Telangana – 500036,<br />
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
          </section>

          <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} WURQ PROJECTS PRIVATE LIMITED. All
            Rights Reserved.
          </div>

        </div>
      </div>
    </section>
  );
}