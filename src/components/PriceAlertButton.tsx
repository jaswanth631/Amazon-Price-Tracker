import { useState } from "react";
import axios from "axios";

const PriceAlert = ({ product }) => {
  const [email, setEmail] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  const handleSetAlert = async () => {
    try {
      // Send request to backend to set the price alert
      const response = await axios.post("/api/price-alert", {
        email,
        asin: product.asin,
        currentPrice: product.currentPrice,
      });
      if (response.status === 200) {
        setAlertSet(true);
        alert("Price alert set successfully!");
      }
    } catch (error) {
      console.error("Error setting price alert:", error);
      alert("Failed to set price alert.");
    }
  };

  return (
    <div>
      {!alertSet ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSetAlert}>Set Price Alert</button>
        </>
      ) : (
        <p>Price alert set. You will be notified when the price drops!</p>
      )}
    </div>
  );
};

export default PriceAlert;
