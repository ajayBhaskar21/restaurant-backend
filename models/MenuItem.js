const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageURL: { type: String },
    type: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    category: { type: String, enum: ["Tiffin", "Starter", "Biryani", "Fried Rice", "Curry", "Drink", "Ice Cream", "Cake", "Dessert", "Meals"], required: true }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
