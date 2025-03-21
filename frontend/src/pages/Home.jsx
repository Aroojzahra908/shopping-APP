import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css"; // Adjust the path if necessary

const API_URL = "http://127.0.0.1:8000"; // Change this if needed

export default function Home() {
  const [items, setItems] = useState([]);
  const [offers, setOffers] = useState({});
  const [order, setOrder] = useState({ item_id: "", quantity: 1 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch items
    axios.get(`${API_URL}/items`).then((res) => {
      console.log("Items:", res.data); // Log the items fetched from the backend
      setItems(res.data);
    });

    // Fetch offers
    axios.get(`${API_URL}/offers`).then((res) => setOffers(res.data));
  }, []);

  const handleOrder = async () => {
    console.log("Order State: ", order); // Log the current order state

    if (!order.item_id) {
      setMessage("❌ Please select an item before ordering.");
      return;
    }

    // Find the selected item by ID
    const selectedItem = items.find((item) => item.id === parseInt(order.item_id)); // Ensure item ID is an integer

    // If the selected item is not found
    if (!selectedItem) {
      setMessage("❌ Item not found in the list.");
      return;
    }

    console.log("Selected Item: ", selectedItem); // Log selected item for debugging

    // Calculate total price
    let totalPrice = selectedItem.price * order.quantity;

    // Apply discount if available
    if (offers[order.item_id]) {
      const discount = offers[order.item_id];
      totalPrice -= (totalPrice * discount) / 100;
    }

    try {
      const res = await axios.post(`${API_URL}/orders`, {
        item_id: order.item_id,
        quantity: order.quantity,
      });

      console.log("Order Response: ", res.data); // Log the response from the API

      setMessage(`✅ Order Placed! Total Price: $${totalPrice.toFixed(2)}`);
      setOrder({ item_id: "", quantity: 1 });
    } catch (err) {
      console.error("Error placing order:", err); // Log error if the API call fails
      setMessage("❌ Order Failed. Please try again.");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛒 Available Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md p-4 rounded-lg border hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              <h2 className="font-bold text-lg text-gray-700">{item.name}</h2>
              <p className="text-gray-600">
                💰 Price: <span className="font-bold">${item.price}</span>
              </p>
              <p className="text-gray-600">
                📦 Stock: <span className="font-bold">{item.stock}</span>
              </p>
              {/* Display offer if applicable */}
              {offers[item.id] && (
                <p className="text-green-500 font-bold">🎉 Discount: {offers[item.id]}% off</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items available</p>
        )}
      </div>

      <h2 className="text-xl font-bold mt-10 text-gray-700 text-center">🛍️ Place an Order</h2>

      <div className="flex flex-col items-center mt-4">
        <select
          className="border p-2 w-64 rounded-md bg-white shadow-sm"
          value={order.item_id}
          onChange={(e) => {
            const selectedItemId = e.target.value;
            console.log("Selected item_id:", selectedItemId); // Log selected item_id
            setOrder({ ...order, item_id: selectedItemId });
          }}
        >
          <option value="">🔽 Select an Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 mt-2 w-64 rounded-md"
          min="1"
          max={items.find((item) => item.id === parseInt(order.item_id))?.stock || 10}
          value={order.quantity}
          onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value) })}
        />

        <button
          className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-md hover:bg-blue-600 transition"
          onClick={handleOrder}
        >
          🛍️ Order Now
        </button>
      </div>

      {message && <p className="mt-4 text-center text-lg font-bold text-gray-700">{message}</p>}
    </div>
  );
}
