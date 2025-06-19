import React, { useState } from "react";
import { User } from "lucide-react";
import "./header.css";

interface HeaderProps {
  userName?: string | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  onLogout,
  onLoginClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="logo">MensaBZZ</div>
      <div className="header-right">
        <div className="avatar-wrapper">
          <div className="avatar" onClick={toggleMenu}>
            <User size={20} color="white" />
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              {userName ? (
                <>
                  <div className="dropdown-name">{userName}</div>
                  <button className="logout-btn" onClick={onLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="login-btn" onClick={onLoginClick}>
                    Anmelden
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
