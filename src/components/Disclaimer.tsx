import React from "react";
import { Link } from "react-router-dom";

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> / Page
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Disclaimer</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <p>
            The information provided on this website is for general informational purposes only.
            The content is provided by <span className="font-semibold">kawaiworld.co.in</span>, and while
            we strive to ensure that all information is accurate and up-to-date, we make no
            representations or warranties—express or implied—about the completeness, accuracy,
            reliability, suitability, or availability of the website or the information, products,
            services, or related graphics contained on the website for any purpose. Any reliance you
            place on such information is strictly at your own risk.
          </p>

          <p>
            In no event shall <span className="font-semibold">kawaiworld.co.in</span> be liable for
            any loss or damage, including without limitation indirect or consequential loss or
            damage, or any loss or damage whatsoever arising from the loss of data or profits
            arising out of or in connection with the use of this website.
          </p>

          <p>
            Through this website, you may link to external websites that are not under the control of
            <span className="font-semibold"> kawaiworld.co.in</span>. We have no control over the
            nature, content, and availability of those external sites. The inclusion of any links
            does not imply a recommendation or endorsement of the views expressed within them.
          </p>

          <p>
            Every effort is made to keep this website running smoothly. However,
            <span className="font-semibold"> kawaiworld.co.in</span> takes no responsibility for,
            and will not be liable for, the website being temporarily unavailable due to technical
            issues beyond our control.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Disclaimer;
