import React, { useState, useEffect } from "react";
import axios from "axios";
import {url} from "../../services/url";

function CrudUI() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", desc: "", qty: "" });

  // Fetch items from backend
  useEffect(() => {
    axios
      .get(`${url}/items`)
      .then((res) => setItems(res.data.items))
      .catch((err) => console.error("Fetch error:", err));
  });

  // Safe filter to avoid "toLowerCase of undefined"
  const filtered = items.filter((it) => {
    const name = it?.name?.toLowerCase() || "";
    const desc = it?.desc?.toLowerCase() || "";
    return (
      name.includes(query.toLowerCase()) ||
      desc.includes(query.toLowerCase())
    );
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", desc: "", qty: "" });
    setIsModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || "",
      desc: item.desc || "",
      qty: String(item.qty || 0),
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
     
      await axios.delete(`${url}/items/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, qty: Number(form.qty) };

      if (editing) {
        const res = await axios.put(
          `${url}/items/${editing._id}`,
          payload
        );
        setItems((prev) =>
          prev.map((p) => (p.id === editing.id ? res.data : p))
        );
      } else {
        const res = await axios.post(`${url}/add`, payload);
        setItems((prev) => [...prev, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  useEffect(() => {
    if (!isModalOpen) setEditing(null);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Inventory — CRUD UI
          </h1>
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or description..."
              className="px-3 py-2 border rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 text-sm"
            >
              + Add Item
            </button>
          </div>
        </header>

        {/* Table */}
        <main>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">
                        No items found.
                      </td>
                    </tr>
                  ) : (

                    filtered.map((it, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-800">
                            {it.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {index+1}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {it.desc}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                            {it.qty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(it)}
                            className="px-3 py-1.5 border rounded text-indigo-600 hover:bg-indigo-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(it._id)}
                            className="px-3 py-1.5 border rounded text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))

                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <form
            onSubmit={handleSubmit}
            className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editing ? "Edit Item" : "Add Item"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Name</div>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <input
                  value={form.desc}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, desc: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Quantity</div>
                <input
                  type="number"
                  min="0"
                  value={form.qty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, qty: e.target.value }))
                  }
                  className="w-40 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 text-white text-sm"
              >
                {editing ? "Save Changes" : "Create Item"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CrudUI;
