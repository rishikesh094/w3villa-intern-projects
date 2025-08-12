const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);
module.exports = ItemModel;
