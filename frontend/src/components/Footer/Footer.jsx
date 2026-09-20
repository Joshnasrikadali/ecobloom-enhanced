import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-container">
        {/* About Section */}
        <div>
          <h1 className="footer-title-main">EcoBloom</h1>
          <h2 className="footer-title">Carbon Footprint Calculator</h2>
          <p className="footer-text">
            Helping you track and reduce your carbon footprint with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/calculate">Calculator</a></li>
            <li><a href="/redeem">Redeem</a></li>
            <li><a href="/carbonInfo">Carbon footprint</a></li>
            <li><a href="/learn-play">Games</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        © 2025 Carbon Footprint Calculator. All Rights Reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
