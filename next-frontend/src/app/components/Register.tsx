"use client";

import * as React from "react";
import { useState } from "react";
import { UserPlus, Lock, Mail, ChevronLeft } from "lucide-react";
import "./register.css";

interface RegisterProps {
  goToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ goToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Registration successful:', result);
        alert("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
        if (goToLogin) {
          goToLogin();
        }
      } else {
        const errorText = await response.text();
        setError(errorText || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="back-button"
        onClick={goToLogin}
        aria-label="Zurück zum Login"
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 5,
          fontSize: 24,
          color: "#333",
          zIndex: 1000,
        }}
      >
        <ChevronLeft />
      </button>
      <div className="container">
        <div className="card">
          <div className="icon-wrapper">
            <UserPlus className="icon" />
          </div>
          <h2 className="title">Konto erstellen</h2>
          <p className="subtitle">Werde Teil der Mensa-App!</p>
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon mail-icon">
                <Mail className="icon-small" />
              </span>
              <input
                placeholder="E-Mail"
                type="email"
                value={email}
                className="input"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="input-wrapper">
              <span className="input-icon lock-icon">
                <Lock className="icon-small" />
              </span>
              <input
                placeholder="Passwort"
                type="password"
                value={password}
                className="input"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="input-wrapper">
              <span className="input-icon lock-icon">
                <Lock className="icon-small" />
              </span>
              <input
                placeholder="Passwort bestätigen"
                type="password"
                value={confirmPassword}
                className="input"
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <div className="error-text">{error}</div>}
          </div>
          <button 
            onClick={handleRegister} 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Wird registriert...' : 'Registrieren'}
          </button>
          <p className="register-link">
            Schon ein Konto? <button onClick={goToLogin}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
