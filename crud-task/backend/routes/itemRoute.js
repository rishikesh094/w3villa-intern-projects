const express = require("express");
const { handleAddItem, handleGetItem, handleDeleteItem, handleUpdateItem } = require("../controllers/handleItem");

const router = express.Router();

router.post("/add", handleAddItem);
router.get("/items", handleGetItem);
router.delete("/items/:id", handleDeleteItem)
router.put("/items/:id", handleUpdateItem)

module.exports = router;
