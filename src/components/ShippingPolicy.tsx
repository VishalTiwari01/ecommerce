import React from "react";
import { Link } from "react-router-dom";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> / Page
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipping Policy</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          {/* Intro */}
          <p>
            The following information outlines the shipping policy of 
            <span className="font-semibold"> kawaiworld.co.in</span>.
          </p>

          {/* General Shipping Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              General Shipping Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery Coverage: Shipping available to most pin codes across India.</li>
              <li>
                <span className="font-semibold">Order Dispatch:</span><br />
                Orders placed before <strong>11:30 AM</strong> are dispatched the same day.<br />
                Orders placed after 11:30 AM are dispatched the next working day (excluding Sundays & holidays).
              </li>
              <li>Prepaid orders are prioritized.</li>
              <li>
                <span className="font-semibold">Cash on Delivery (COD) Orders:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>COD orders are verified via phone call.</li>
                  <li>Up to 3 verification attempts + a WhatsApp attempt.</li>
                  <li>If verification fails within 3 days, the order is canceled.</li>
                  <li>Most products are eligible for COD.</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Shipping Charges Table */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping Charges</h2>

            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">Product Type</th>
                    <th className="p-3 border text-left">Order Amount (INR)</th>
                    <th className="p-3 border text-left">Shipping Rate (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">Normal Products</td>
                    <td className="p-3 border">0 – 699</td>
                    <td className="p-3 border">70</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Normal Products</td>
                    <td className="p-3 border">Above 699</td>
                    <td className="p-3 border">0</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Limited Edition Collection</td>
                    <td className="p-3 border">0 – 298</td>
                    <td className="p-3 border">200</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Limited Edition Collection</td>
                    <td className="p-3 border">299 – 596</td>
                    <td className="p-3 border">400</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Limited Edition Collection</td>
                    <td className="p-3 border">Above 596</td>
                    <td className="p-3 border">600</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              <strong>Additional Charges:</strong><br />
              COD orders include an extra <strong>₹100</strong> handling fee.
            </p>

            <h3 className="text-lg font-semibold mt-5">Exceptional Products Shipping Rates:</h3>

            <div className="overflow-x-auto mt-3">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border text-left">Product Type/Name</th>
                    <th className="p-3 border text-left">Order Quantity</th>
                    <th className="p-3 border text-left">Shipping Rate (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">Hot Wheels Mainline</td>
                    <td className="p-3 border">1 Model</td>
                    <td className="p-3 border">70</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Hot Wheels Zamac Pack (Limited Edition)</td>
                    <td className="p-3 border">1 Pack</td>
                    <td className="p-3 border">600</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Hot Wheels Pop Culture (Limited Edition)</td>
                    <td className="p-3 border">1 Model</td>
                    <td className="p-3 border">300</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Hot Wheels Ultra Hots Retro (Limited Edition)</td>
                    <td className="p-3 border">1 Model</td>
                    <td className="p-3 border">120</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              Shipping & handling charges are <strong>non-refundable</strong> in case of returns or cancellations.
              kawaiworld.co.in may revise charges anytime; updates will be displayed on product pages and during checkout.
            </p>
          </section>

          {/* Delivery Time */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Estimated Delivery Time</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Tier 1 Cities: <strong>3–4 days</strong></li>
              <li>Tier 2 Cities: <strong>4–6 days</strong></li>
              <li>Tier 3 Cities: <strong>4–8 days</strong></li>
              <li>Kolkata: <strong>Same day or next day</strong></li>
              <li>J&K and North East: <strong>6–8 days</strong></li>
              <li>Heavy/large shipments may take longer.</li>
            </ul>

            <p className="mt-3">
              *Delivery timelines may vary due to logistics delays or weather conditions.
              kawaiworld.co.in may cancel orders that cannot be reasonably delivered.
            </p>
          </section>

          {/* Express Shipping */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Express Shipping</h2>
            <p>
              For express shipping, email us at 
              <strong> sales@kawaiworld.co.in</strong>.
              Available for select pin codes; extra charges apply.
            </p>
          </section>

          {/* Special Occasions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Special Occasion Deliveries</h2>
            <p>
              For birthdays or festive occasions, inform us via email or WhatsApp for timely delivery arrangements.
            </p>
          </section>

          {/* Hidden Charges */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Hidden Charges</h2>
            <p>No hidden charges. Prices shown at checkout are final.</p>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">International Shipping</h2>
            <p>
              International delivery is not available. Customers abroad may place orders using international cards,
              but delivery is restricted to Indian addresses.
            </p>
          </section>

          {/* Tracking */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tracking Packages</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Email containing courier name & tracking number is sent after dispatch.</li>
              <li>If not received within 24 hours, check the spam folder.</li>
            </ul>
          </section>

          {/* Non Availability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Non-Availability on Delivery</h2>
            <p>
              Couriers attempt multiple deliveries before returning the package.
              Ensure correct contact details for fast delivery.
            </p>
          </section>

          {/* Reverse Shipping */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Reverse Shipping</h2>
            <p>A nominal fee of <strong>₹100</strong> applies to reverse shipping requests.</p>
          </section>

          {/* Change in Delivery Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Change in Delivery Details</h2>
            <p>Delivery details cannot be changed once the order is shipped.</p>
          </section>

          {/* Reshipping */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Reshipping of Unaccepted Orders</h2>
            <p>
              If a prepaid order is not accepted and must be re-shipped, charges apply:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Original delivery charge</li>
              <li>Processing fee of <strong>₹150</strong></li>
            </ul>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
            <p>
              For assistance, email us at 
              <strong> sales@kawaiworld.co.in</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;
