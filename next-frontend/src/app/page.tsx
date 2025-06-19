"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MenuOverview from "./components/MenuOverview";
import Login from "./components/Login";
import Register from "./components/Register";

export default function HomePage() {
  const [page, setPage] = useState<"menu" | "login" | "register">("menu");
  const [userName, setUserName] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    setUserName(null);
    setPage("menu");
  };

  //handleloginsuccess var
  const handleLoginSuccess = (name = "Max Mustermann") => {
    setUserName(name);
    setPage("menu");
  };

  return (
    <>
      {page === "menu" && (
        <>
          <Header
            userName={userName}
            onLogout={handleLogout}
            onLoginClick={() => setPage("login")}
          />
          <MenuOverview isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </>
      )}
      {page === "login" && (
        <Login
          onSuccessLogin={() => handleLoginSuccess("Max Mustermann")}
          goToRegister={() => setPage("register")}
          goToMenuOverview={() => setPage("menu")}
        />
      )}
      {page === "register" && <Register goToLogin={() => setPage("login")} />}
    </>
  );
}
