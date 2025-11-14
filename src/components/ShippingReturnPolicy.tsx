import React from "react";
import { Link } from "react-router-dom";

const ShippingReturnPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> / Page
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Shipping & Return Policy
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          At <span className="font-semibold">Kawaiworld.co.in</span>, we strive to provide 
          a seamless shopping experience for our customers. This Shipping & Return Policy 
          outlines the terms related to the delivery of our products and the process for 
          returns and refunds.
        </p>

        {/* --------------------------- SHIPPING POLICY --------------------------- */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Shipping Policy
          </h2>

          <div className="space-y-5 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900">1. Order Processing</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Orders are processed within 1–3 business days after payment confirmation.</li>
                <li>You will receive a confirmation email with order details once placed.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">2. Shipping Methods & Delivery Time</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>We offer reliable and timely shipping services.</li>
                <li>Delivery time ranges from 3–7 business days depending on location.</li>
                <li>We will notify you in case of delays due to unforeseen reasons.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">3. Shipping Charges</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Shipping charges (if applicable) are shown during checkout.</li>
                <li>Free shipping may be available during promotions or minimum order value.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">4. Delivery Address</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Please ensure the address provided is accurate and complete.</li>
                <li>We are not responsible for delays due to incorrect addresses.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">5. Tracking Your Order</h3>
              <p className="mt-1">
                Once shipped, you will receive a tracking ID via email or SMS.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------- RETURN POLICY --------------------------- */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Return Policy
          </h2>

          <p className="text-gray-700 mb-4">
            Considering the nature of our products, **we do not offer returns or exchanges**.  
            Refunds will only be processed under specific conditions mentioned below.
          </p>

          <div className="space-y-5 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900">1. Eligibility for Returns</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Item is defective, damaged, or incorrect.</li>
                <li>Return request must be made within 7 days of delivery.</li>
                <li>
                  <span className="font-semibold">An uncut video</span> from opening the parcel 
                  until the issue is shown is <span className="font-semibold">MANDATORY</span>.
                </li>
                <li>Product must be unused, in original packaging with all tags.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">2. Non-Returnable Items</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Customized / personalized gifts.</li>
                <li>Items purchased during clearance or special sales (unless defective).</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">3. Return Process</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>
                  Contact support at <a href="mailto:info@kawaiworld.co.in" className="text-blue-600">
                    info@kawaiworld.co.in
                  </a>{" "}
                  or call <span className="font-semibold">+91 98186 34660</span>.
                </li>
                <li>Our team will assist and provide a return label if applicable.</li>
                <li>Pack the item securely and include a copy of the invoice.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">4. Refund Process</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Refunds are processed within 7–10 business days after inspection.</li>
                <li>Refund is credited to the original payment method.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --------------------------- EXCHANGE POLICY --------------------------- */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Exchange Policy
          </h2>

          <p className="text-gray-700 leading-relaxed">
            We provide exchanges only for defective or damaged products.  
            Exchange requests depend on availability.
          </p>
        </section>

        {/* --------------------------- CONTACT --------------------------- */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>

          <p className="text-gray-700 leading-relaxed">
            If you have any questions related to shipping or returns, feel free to contact us:
          </p>

          <ul className="mt-3 text-gray-700 space-y-1">
            <li>
              Email:{" "}
              <a href="mailto:info@kawaiworld.co.in" className="text-blue-600 underline">
                info@kawaiworld.co.in
              </a>
            </li>
            <li>
              Phone: <span className="font-semibold">+91 98186 34660</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default ShippingReturnPolicy;
