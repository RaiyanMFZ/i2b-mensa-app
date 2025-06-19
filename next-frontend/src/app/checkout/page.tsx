"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Checkout from "../components/Checkout";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();

  // Wenn der Warenkorb leer ist, zurück zur Hauptseite
  if (items.length === 0) {
    router.push("/");
    return null;
  }

  const handleBack = () => {
    router.push("/");
  };

  const handleComplete = () => {
    clearCart(); // Leere den Warenkorb nach erfolgreicher Zahlung
    router.push("/");
  };

  return (
    <Checkout items={items} onBack={handleBack} onComplete={handleComplete} />
  );
};

export default CheckoutPage;
