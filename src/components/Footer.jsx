import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-3">About Deliver At Door</h3>
            <p className="text-gray-400">
              Deliver At Door is a smart logistics platform offering real-time tracking,
              route optimization, and hassle-free delivery management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3">Quick Links</h3>
            <ul>
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/track-order" className="text-gray-400 hover:text-white">
                  Track Order
                </a>
              </li>
              <li>
                <a href="/admin-dashboard" className="text-gray-400 hover:text-white">
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-xl font-bold mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Deliver At Door. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
