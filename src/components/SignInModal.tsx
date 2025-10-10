import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Logo from "../assest/logoA.png";
import { loginUser } from "../APi/api";

const SignInModal = ({ isOpen, onClose, onSignIn }) => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const user = await loginUser(mobile, dispatch);
      onSignIn(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 h-screen z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-card p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <img src={Logo} alt="Company Logo" className="h-24 w-auto" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#7A6A9C] to-[#BBA0D4] text-transparent bg-clip-text">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-black py-2 rounded-md hover:brightness-90 transition disabled:opacity-60"
                style={{ backgroundColor: "#F7D2CF" }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInModal;
