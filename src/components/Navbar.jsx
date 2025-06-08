import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Navbar = ({ admin }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showCart, setShowCart] = useState(false);

  // Retrieve user and cart data from localStorage or API
  useEffect(() => {
    const loadFromStorage = () => {
      const userString = localStorage.getItem("user");
      const cartData = localStorage.getItem("cart");

      if (userString) {
        try {
          setUser(JSON.parse(userString));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }

      if (cartData) {
        try {
          setCart(JSON.parse(cartData));
        } catch (error) {
          console.error("Failed to parse cart data:", error);
          localStorage.removeItem("cart");
        }
      } else {
        setCart([]);
      }
    };

    loadFromStorage();

    // Listen to localStorage changes
    window.addEventListener("storage", loadFromStorage);

    return () => {
      window.removeEventListener("storage", loadFromStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    setCart([]);
    navigate("/auth"); // Redirect to the login page after logout
  };

  const getPortalTitle = () => {
    if (admin) return "Deliver At Door Admin";
    if (user?.role === "delivery_partner") return "Delivery Portal";
    if (user?.role === "customer") return "Customer Portal";
    return "Deliver At Door";
  };

  const getNavigationLinks = () => {
    if (admin) return null;

    if (user?.role === "delivery_partner") {
      return (
        <>
          <Link to="/delivery/dashboard" className="hover:text-blue-400 transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/delivery/orders" className="hover:text-blue-400 transition-colors duration-200">
            Orders
          </Link>
          <Link to="/delivery/profile" className="hover:text-blue-400 transition-colors duration-200">
            Profile
          </Link>
        </>
      );
    }

    if (user?.role === "customer") {
      return (
        <>
          <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
            Home
          </Link>
          <Link to="/orders" className="hover:text-blue-400 transition-colors duration-200">
            Orders
          </Link>
          <Link to="/track-order" className="hover:text-blue-400 transition-colors duration-200">
            Track Order
          </Link>
          <Link to="/profile" className="hover:text-blue-400 transition-colors duration-200">
            Profile
          </Link>
        </>
      );
    }

    return (
      <>
        <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
          Home
        </Link>
        <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">
          About
        </Link>
        <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">
          Contact
        </Link>
      </>
    );
  };

  const CartSummary = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="relative">
        <button
          onClick={() => setShowCart(!showCart)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          🛒 <span className="ml-2">{totalItems} items</span>
        </button>

        {showCart && (
          <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg z-20">
            <div className="p-4 border-b font-semibold">Your Cart</div>
            <ul className="max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <li className="p-4 text-center text-gray-500">Cart is empty</li>
              ) : (
                cart.map((item, index) => (
                  <li key={index} className="flex justify-between p-2 border-b text-sm">
                    <span>{item.name}</span>
                    <span>{item.quantity} × ₹{item.price}</span>
                  </li>
                ))
              )}
            </ul>
            <div className="p-4 font-semibold text-right border-t">
              Total: ₹{totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-gray-950 text-white shadow-md w-full">
      <div className="flex justify-between items-center h-20 px-6 md:px-12">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to={admin ? "/admin/dashboard" : "/"}
            className="text-3xl font-extrabold tracking-tight text-white hover:text-gray-300 transition-colors duration-200"
          >
            {getPortalTitle()}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 md:space-x-10 text-base md:text-lg">
          {getNavigationLinks()}

          {/* Cart and User Info */}
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === "customer" && <CartSummary />}
              <span className="text-sm text-gray-300 flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                <span className="text-green-400 text-lg">
                  {user.role === "delivery_partner" ? "🚚" : "👤"}
                </span>
                {user.name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-sm px-4 py-2 rounded-xl shadow transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-xl shadow transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.defaultProps = {
  admin: false,
};

Navbar.propTypes = {
  admin: PropTypes.bool,
};

export default Navbar;
