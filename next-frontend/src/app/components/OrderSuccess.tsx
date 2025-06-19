import React from "react";
import { CheckCircle, Home, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import "./orderSuccess.css";

interface OrderSuccessProps {
  orderNumber: string;
  total: number;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderNumber, total }) => {
  const router = useRouter();

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>

        <h1>Vielen Dank für Ihre Bestellung!</h1>
        <p className="success-message">
          Ihre Bestellung wurde erfolgreich aufgegeben und wird in der Mensa für
          Sie vorbereitet.
        </p>

        <div className="order-details">
          <div className="order-detail-item">
            <span>Bestellnummer</span>
            <strong>{orderNumber}</strong>
          </div>
          <div className="order-detail-item">
            <span>Gesamtbetrag</span>
            <strong>{total.toFixed(2)} CHF</strong>
          </div>
        </div>

        <div className="success-info">
          <div className="info-card">
            <Receipt size={24} />
            <h3>Ihre Bestellung</h3>
            <p>
              Sie können Ihre Bestellung während den Öffnungszeiten in der Mensa
              abholen.
            </p>
          </div>
        </div>

        <div className="success-actions">
          <button className="home-button" onClick={() => router.push("/")}>
            <Home size={20} />
            <span>Zurück zur Startseite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
