import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "../assest/logoA.png";

const Footer = () => {
  const socialIcons = [
    { icon: <FaFacebookF />, name: "Facebook" },
    { icon: <FaInstagram />, name: "Instagram" },
    { icon: <FaLinkedinIn />, name: "LinkedIn" },
    { icon: <FaWhatsapp />, name: "WhatsApp" },
  ];

  return (
    <footer className="bg-card/50 border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <img src={Logo} alt="" />
              </div>
              <span className="text-2xl font-bold gradient-text font-kids">
                KidsWorld
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Making childhood magical with safe, fun, and educational products
              that inspire creativity and learning.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map(({ icon, name }, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
                  aria-label={name}
                  title={name}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Updated Quick Links block using <Link> */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-primary transition-colors"
                >
                  Shipping & Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms&use"
                  className="hover:text-primary transition-colors"
                >
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="hover:text-primary transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-primary transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Office Address</h4>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Kawai World, Shop No.-6, ML-2, Gaur Empire Complex, <br />
              Sector-11, Vasundhara, Ghaziabad - 201012 <br />
              (Kisan Chowk, Near Haldiram)
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2024 KawaiWorld. Made with 💖 for amazing kids and parents.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
