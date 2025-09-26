
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, LogOut, ShoppingBag, UserCircle2 } from "lucide-react";

const UserDropdown = ({
  isOpen,
  onClose,
  isAuthenticated,
  onSignInClick,
  onLogout,
  user, // ✅ Optional: pass user info from Navbar
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex flex-col py-2 text-sm">
            {isAuthenticated ? (
              <>
                

                {/* <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-foreground transition"
                  onClick={onClose}
                >
                  <UserCircle2 size={18} />
                  My Account
                </Link> */}

                <Link
                  to="/order"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-foreground transition"
                  onClick={onClose}
                >
                  <ShoppingBag size={18} />
                  My Orders
                </Link>

                <button
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-left text-foreground transition"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-left text-foreground transition"
                onClick={() => {
                  onSignInClick();
                  onClose();
                }}
              >
                <User size={18} />
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDropdown;
