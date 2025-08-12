const ItemModel = require("../models/itemsModel");

async function handleAddItem(req, res) {
  try {
    const data = req.body;

    const newItem = await ItemModel.create(data);

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ success: false, message: "Failed to add item" });
  }
}

async function handleGetItem(req, res) {
  try {
    const items = await ItemModel.find(); 
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
}

async function handleDeleteItem(req, res) {
  try {
    const { id } = req.params;

    const deletedItem = await ItemModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

async function handleUpdateItem(req, res) {
  try {
    const data = req.body;
    const { id } = req.params;
    const updatedItem = await ItemModel.findByIdAndUpdate(id, {
      name: data.name,
      desc: data.desc,
      qty: data.qty,
    });

    res.status(201).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ success: false, message: "Failed to add item" });
  }
}

module.exports = {
  handleAddItem,
  handleGetItem,
  handleDeleteItem,
  handleUpdateItem,
};
