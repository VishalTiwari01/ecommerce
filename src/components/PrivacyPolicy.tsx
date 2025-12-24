import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          / Page
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700 leading-relaxed mb-6">
          Welcome to <span className="font-semibold">Kawaiworld.co.in</span>,
          your trusted destination for kids’ gifts and more! We are committed to
          protecting your privacy and ensuring a secure shopping experience.
          This Privacy Policy explains how we collect, use, and safeguard your
          information when you visit our website or use our services.
        </p>

        {/* --------------------------- PRIVACY SECTIONS --------------------------- */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="mt-1">We may collect the following information:</p>

            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Personal Information:</strong> Your name, email address
                (kawaiworld.co.in), phone number (+91 98186 34660), shipping
                address, and payment details when you make a purchase or
                interact with us.
              </li>
              <li>
                <strong>Non-Personal Information:</strong> Device details,
                browser type, IP address, and site usage data gathered via
                cookies and similar technologies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To process and deliver your orders.</li>
              <li>To respond to inquiries and provide customer support.</li>
              <li>To send updates, promotions, and special offers.</li>
              <li>To improve our website and overall shopping experience.</li>
              <li>
                To ensure site security and prevent fraudulent activities.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Sharing Your Information
            </h2>

            <p className="mt-1">
              We do not sell or rent your personal information. However, we may
              share it under these conditions:
            </p>

            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Service Providers:</strong> With partners who assist in
                payment processing, deliveries, and site management.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or
                necessary to protect our rights.
              </li>
              <li>
                <strong>Business Transfers:</strong> Your information may
                transfer during mergers, acquisitions, or asset sales.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mt-1">
              Our website uses cookies to enhance your shopping experience.
              Cookies help personalize visits and enable targeted promotions.
              You may disable cookies via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Data Security
            </h2>
            <p className="mt-1">
              We use advanced security measures to protect your personal
              information. However, no online system is completely secure. We
              encourage you to use caution when sharing data online.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Your Choices and Rights
            </h2>

            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Access, update, or request deletion of your personal data.
              </li>
              <li>
                Opt-out of marketing emails by contacting us at kawaiworld.co.in
                or +91 98186 34660.
              </li>
              <li>Disable cookies in your browser to limit tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Third-Party Links
            </h2>
            <p className="mt-1">
              Our website may include links to third-party sites. We are not
              responsible for their privacy practices and recommend reviewing
              their policies before use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Changes to This Privacy Policy
            </h2>
            <p className="mt-1">
              This Privacy Policy may be updated periodically. Any changes will
              be posted here with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Contact Us
            </h2>
            <p className="mt-1">
              For any privacy-related questions or requests, please reach out:
            </p>

            <ul className="mt-2 space-y-1">
              <li>
                Email: <span className="font-semibold">info@kawaiworld.co.in</span>
              </li>
              <li>
                Phone: <span className="font-semibold">+91 98186 34660</span>
              </li>
              <li>
                You may contact us using the information below: Merchant Legal
                entity name: KAWAI WORLD Registered Address: , Gaur Empire
                Complex, ML-2, B-6, Sector 11, Ghaziabad, Uttar Pradesh 201012
                Ghaziabad UTTAR PRADESH 201012 Operational Address: , Gaur
                Empire Complex, ML-2, B-6, Sector 11, Ghaziabad, Uttar Pradesh
                201012 Ghaziabad UTTAR PRADESH 201012 Telephone No: +91 98186 34660
                E-Mail ID: info@kawaiworld.co.in
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
