import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Change this if needed

export default function Admin() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", stock: "", offer: "" });
  const [editingItem, setEditingItem] = useState(null); // Add state for the item being edited

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/items`);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.stock) return;

    try {
      await axios.post(`${API_URL}/items-management`, [
        {
          name: newItem.name,
          price: parseFloat(newItem.price),
          stock: parseInt(newItem.stock),
          offer: newItem.offer ? parseInt(newItem.offer) : 0,
        },
      ]);
      setNewItem({ name: "", price: "", stock: "", offer: "" });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.stock) return;

    try {
      await axios.put(`${API_URL}/items-management/${editingItem.id}`, {
        name: newItem.name,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock),
        offer: newItem.offer ? parseInt(newItem.offer) : 0,
      });

      // Directly update the state without fetching from the API again
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.id === editingItem.id) {
            return { ...item, ...newItem }; // Update the item
          }
          return item;
        });
        return updatedItems;
      });

      setNewItem({ name: "", price: "", stock: "", offer: "" });
      setEditingItem(null); // Clear editing state
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/items-management/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item); // Set item for editing
    setNewItem({ ...item, offer: item.offer || "" }); // Populate form with item values
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛠️ Admin Panel</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-3">{editingItem ? "✏️ Edit Item" : "➕ Add New Item"}</h2>
        <input
          type="text"
          placeholder="Item Name"
          className="border p-2 w-full mb-2"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full mb-2"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          className="border p-2 w-full mb-2"
          value={newItem.stock}
          onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
        />
        <input
          type="number"
          placeholder="Offer (Optional)"
          className="border p-2 w-full mb-2"
          value={newItem.offer}
          onChange={(e) => setNewItem({ ...newItem, offer: e.target.value })}
        />
        <button
          className={`${
            editingItem ? "bg-blue-500" : "bg-green-500"
          } text-white px-4 py-2 rounded-md w-full mt-2`}
          onClick={editingItem ? handleUpdateItem : handleAddItem}
        >
          {editingItem ? "✏️ Update Item" : "➕ Add Item"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-3">📦 Available Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white shadow-md p-4 rounded-lg border">
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p>💰 Price: ${item.price}</p>
            <p>📦 Stock: {item.stock}</p>
            <p>🎉 Offer: {item.offer}%</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-full"
              onClick={() => handleEditItem(item)}
            >
              ✏️ Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md w-full"
              onClick={() => handleDelete(item.id)}
            >
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
