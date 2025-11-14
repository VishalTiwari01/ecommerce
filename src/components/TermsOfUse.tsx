import React from "react";
import { Link } from "react-router-dom";

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> / Page
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Use</h1>

        <p className="text-gray-700 leading-relaxed mb-6">
          Welcome to <span className="font-semibold">Kawaiworld.co.in</span>, your trusted kids’ gift shop!  
          These Terms of Use govern your access to and use of our website, services, and products.  
          By using our website, you agree to comply with these terms. Please read them carefully.
        </p>

        {/* --------------------------- TERMS --------------------------- */}
        <div className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-1">
              By accessing Kawaiworld.co.in, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Use and our Privacy Policy. If you do 
              not agree, please refrain from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Eligibility</h2>
            <p className="mt-1">
              Our website and services are intended for users aged 18 and above. If you are 
              under 18, you may use the website only under the supervision of a parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Use of Website</h2>
            <p>You agree to use our website only for lawful purposes. You are prohibited from:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Violating any applicable laws or regulations.</li>
              <li>Using our website to distribute harmful content, viruses, or malware.</li>
              <li>Interfering with the website’s functionality or attempting unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Product Information and Availability</h2>
            <ul className="list-disc pl-5 mt-2">
              <li>We strive to provide accurate product descriptions and images; however, slight variations may occur.</li>
              <li>Product availability is subject to stock levels and may change without notice.</li>
              <li>Prices and offers are subject to change at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Orders and Payments</h2>
            <ul className="list-disc pl-5 mt-2">
              <li>All orders are subject to acceptance and availability.</li>
              <li>We reserve the right to cancel or refuse any order.</li>
              <li>Payments must be made using the available payment methods on our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Shipping and Delivery</h2>
            <ul className="list-disc pl-5 mt-2">
              <li>We aim to process and deliver orders promptly.</li>
              <li>Delivery times may vary based on your location.</li>
              <li>Please ensure accurate shipping details to avoid delays.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Returns and Refunds</h2>
            <p>
              For details regarding returns and refunds, please refer to our 
              [Returns & Refund Policy] or contact us at kawaiworld.co.in or +91 98186 34660.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Intellectual Property</h2>
            <p className="mt-1">
              All content on Kawaiworld.co.in, including text, images, logos, and designs, is the 
              property of Kawaiworld.co.in and protected under intellectual property laws.  
              Unauthorized use, reproduction, or redistribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
            <p className="mt-1">
              While we strive for an uninterrupted experience, we do not guarantee constant access to 
              our website. Kawaiworld.co.in is not liable for any direct, indirect, incidental, or 
              consequential damages resulting from use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Changes to Terms</h2>
            <p className="mt-1">
              We may update these Terms of Use periodically. Changes will become effective immediately 
              once posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Contact Information</h2>
            <p className="mt-1">
              For questions or concerns regarding these Terms of Use, please contact us:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Email: <span className="font-semibold">kawaiworld.co.in</span></li>
              <li>Phone: <span className="font-semibold">+91 98186 34660</span></li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TermsOfUse;
