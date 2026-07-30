import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden py-16 px-4">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FD9A00]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FD9A00]/5 blur-3xl rounded-full"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-[#111111] border border-gray-800 rounded-2xl shadow-xl p-6 md:p-10">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
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
              We value your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, store, disclose, and safeguard your information when you use
              our website, book our events, participate in workshops, or
              communicate with us.
            </p>

            <p>
              By accessing or using our website, you agree to the collection and
              use of information in accordance with this Privacy Policy.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Information Collected */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>

            <p className="text-gray-300 leading-8">
              We may collect the following information:
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-3 text-gray-300">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Mobile Number</li>
              <li>Billing Address</li>
              <li>City, State and Country</li>
              <li>Booking Details</li>
              <li>Payment Reference IDs (We do not store card details.)</li>
              <li>IP Address</li>
              <li>Browser Information</li>
              <li>Device Information</li>
              <li>Cookies and Analytics Data</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li>To process event bookings.</li>
              <li>To confirm your registration.</li>
              <li>To communicate event updates.</li>
              <li>To process payments securely.</li>
              <li>To provide customer support.</li>
              <li>To improve our website and services.</li>
              <li>To send invoices and receipts.</li>
              <li>To comply with legal obligations.</li>
              <li>To prevent fraud and unauthorized activities.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Payment Information
            </h2>

            <p className="text-gray-300 leading-8">
              Payments made on our website are securely processed through
              Razorpay or other authorized payment gateways.
            </p>

            <p className="text-gray-300 mt-4 leading-8">
              We do <strong>not</strong> store your debit card, credit card,
              UPI PIN, CVV, net banking passwords, or any sensitive banking
              information on our servers.
            </p>

            <p className="text-gray-300 mt-4 leading-8">
              Payment information is handled directly by our payment gateway
              partners in accordance with applicable security standards.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Cookies
            </h2>

            <p className="text-gray-300 leading-8">
              Our website uses cookies and similar technologies to improve user
              experience, analyze website traffic, remember preferences, and
              enhance website functionality.
            </p>

            <p className="text-gray-300 mt-4">
              You can disable cookies through your browser settings. However,
              some features of the website may not function properly.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Sharing of Information
            </h2>

            <p className="text-gray-300 leading-8">
              We do not sell or rent your personal information.
            </p>

            <p className="text-gray-300 mt-4">
              We may share information only with:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-3 text-gray-300">
              <li>Payment gateway providers.</li>
              <li>Government authorities when legally required.</li>
              <li>Trusted service providers assisting our business.</li>
              <li>Technology partners hosting our website.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Data Security
            </h2>

            <p className="text-gray-300 leading-8">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>

            <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-300">
              <li>SSL Encryption</li>
              <li>Secure Payment Processing</li>
              <li>Restricted Access to Customer Data</li>
              <li>Regular Security Monitoring</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Data Retention
            </h2>

            <p className="text-gray-300 leading-8">
              We retain your information only for as long as necessary to
              provide our services, comply with legal obligations, resolve
              disputes, and enforce our agreements.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Your Rights
            </h2>

            <p className="text-gray-300 mb-4">
              You have the right to:
            </p>

            <ul className="list-disc ml-6 space-y-3 text-gray-300">
              <li>Access your personal information.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Withdraw consent where applicable.</li>
              <li>Contact us regarding privacy concerns.</li>
            </ul>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Third Party */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Third-Party Links
            </h2>

            <p className="text-gray-300 leading-8">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those external
              websites. We encourage users to review their respective privacy
              policies before sharing any personal information.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Children */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Children's Privacy
            </h2>

            <p className="text-gray-300 leading-8">
              Our services are intended for users of all ages. If a booking is
              made for a minor, it should be completed by a parent, guardian, or
              an authorized representative. We do not knowingly collect personal
              information directly from children without appropriate consent.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to This Privacy Policy
            </h2>

            <p className="text-gray-300 leading-8">
              We reserve the right to update or modify this Privacy Policy at
              any time. Changes will become effective immediately upon posting
              on this page. We encourage users to review this page periodically.
            </p>
          </section>

          <hr className="my-10 border-gray-700" />

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              12. Contact Us
            </h2>

            <div className="bg-[#0d0d0d] border border-gray-700 rounded-xl p-6 space-y-4 text-gray-300">

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
                Telangana – 500036,
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