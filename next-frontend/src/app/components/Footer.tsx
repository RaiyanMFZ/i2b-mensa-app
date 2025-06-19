import React from "react";
import { Sun, Moon, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import "./footer.css";

interface FooterProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MensaBZZ</h3>
          <p>Ihre Mensa für gesunde und leckere Mahlzeiten. Frisch zubereitet mit Liebe und Qualität.</p>
          <div className="contact-info">
            <div className="contact-item">
              <MapPin size={16} />
              <span>Seestrasse 110, 8810 Horgen</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+41 44 123 45 67</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@mensabzz.ch</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="footer-section-title">Öffnungszeiten</h3>
          <div className="opening-hours">
            <div className="hours-item">
              <span>Montag - Freitag</span>
              <span>07:00 - 18:00</span>
            </div>
            <div className="hours-item">
              <span>Samstag</span>
              <span>Geschlossen</span>
            </div>
            <div className="hours-item">
              <span>Sonntag</span>
              <span>Geschlossen</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Folgen Sie uns</h3>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
          
          <div className="theme-toggle">
            <button 
              className={`theme-toggle-btn `} 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MensaBZZ. Alle Rechte vorbehalten. | <a href="/privacy">Datenschutz</a> | <a href="/terms">AGB</a></p>
      </div>
    </footer>
  );
};

export default Footer;