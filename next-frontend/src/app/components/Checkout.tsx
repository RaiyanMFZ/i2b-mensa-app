import React, { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Check } from "lucide-react";
import "./checkout.css";
import { CartItem } from "./Cart";
import OrderSuccess from "./OrderSuccess";

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onComplete }) => {
  const [selectedPayment, setSelectedPayment] = useState<
    "twint" | "credit" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') {
      return price;
    }
    // Handle string prices like "4.50 CHF" or "4,50€"
    const cleanPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  };

  const formatPrice = (price: string | number): string => {
    if (typeof price === 'number') {
      return `${price.toFixed(2)} CHF`;
    }
    return price;
  };

  const subtotal = items.reduce((sum, item) => {
    const price = parsePrice(item.price);
    return sum + price * item.quantity;
  }, 0);

  const discount = appliedDiscount ? subtotal * 0.1 : 0; // 10% Rabatt
  const total = subtotal - discount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "BZZ25") {
      setAppliedDiscount(true);
      setDiscountError("");
    } else {
      setDiscountError("Ungültiger Rabattcode");
      setAppliedDiscount(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simuliere Zahlungsverarbeitung
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderComplete(true);
  };

  // Generiere eine zufällige Bestellnummer
  const generateOrderNumber = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BZZ-${random}`;
  };

  if (orderComplete) {
    return <OrderSuccess orderNumber={generateOrderNumber()} total={total} />;
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="checkout-container">
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Zurück zum Warenkorb"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
      </div>

      <div className="checkout-content">
        <h1>Checkout</h1>

        <div className="order-summary">
          <h2>Bestellübersicht</h2>
          {items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">×{item.quantity}</span>
              </div>
              <span className="item-price">
                {(parsePrice(item.price) * item.quantity).toFixed(2)} CHF
              </span>
            </div>
          ))}
          <div className="price-breakdown">
            <div className="price-row">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2)} CHF</span>
            </div>
            {appliedDiscount && (
              <div className="price-row">
                <span>Rabatt (10%)</span>
                <span className="discount-amount">
                  -{discount.toFixed(2)} CHF
                </span>
              </div>
            )}
            <div className="price-row total">
              <span>Gesamtsumme</span>
              <span>{total.toFixed(2)} CHF</span>
            </div>
          </div>
        </div>

        <div className="discount-section">
          <h2>Rabattcode</h2>
          <div className="discount-form">
            <input
              type="text"
              className="discount-input"
              placeholder="Code eingeben"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={appliedDiscount}
            />
            <button
              className="apply-discount-button"
              onClick={handleApplyDiscount}
              disabled={appliedDiscount || !discountCode}
            >
              {appliedDiscount ? "Angewendet" : "Einlösen"}
            </button>
          </div>
          {discountError && (
            <div className="discount-error">{discountError}</div>
          )}
          {appliedDiscount && (
            <div className="discount-success">
              <Check size={16} />
              <span>Rabattcode erfolgreich eingelöst!</span>
            </div>
          )}
          <div className="discount-hint">
            Tipp: Nutze den Code "BZZ25" für 10% Schulrabatt
          </div>
        </div>

        <div className="payment-methods">
          <h2>Zahlungsmethode</h2>
          <div className="payment-options">
            <button
              className={`payment-option ${
                selectedPayment === "twint" ? "selected" : ""
              }`}
              onClick={() => setSelectedPayment("twint")}
            >
              <Smartphone size={24} />
              <span>TWINT</span>
              {selectedPayment === "twint" && (
                <Check size={20} className="check-icon" />
              )}
            </button>
            <button
              className={`payment-option ${
                selectedPayment === "credit" ? "selected" : ""
              }`}
              onClick={() => setSelectedPayment("credit")}
            >
              <CreditCard size={24} />
              <span>Kreditkarte</span>
              {selectedPayment === "credit" && (
                <Check size={20} className="check-icon" />
              )}
            </button>
          </div>

          {selectedPayment === "credit" && (
            <div className="credit-card-form">
              <div className="form-group">
                <label>Kartennummer</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gültig bis</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) =>
                      setCardExpiry(formatExpiry(e.target.value))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    value={cardCVC}
                    onChange={(e) =>
                      setCardCVC(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPayment === "twint" && (
            <div className="twint-info">
              <div className="qr-code-placeholder">
                <span>TWINT QR-Code</span>
                <p>Scannen Sie den Code mit Ihrer TWINT-App</p>
              </div>
            </div>
          )}
        </div>

        <button
          className={`pay-button ${isProcessing ? "processing" : ""}`}
          onClick={handlePayment}
          disabled={!selectedPayment || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <span>Wird verarbeitet...</span>
            </>
          ) : (
            <>
              <span>Jetzt bezahlen</span>
              <span className="pay-amount">{total.toFixed(2)} CHF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
