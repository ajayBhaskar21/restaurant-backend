const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem"); // Import MenuItem model

// Get all menu items
router.get("/view", async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Add new menu item
router.post("/add", async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        await newItem.save();
        res.status(201).json({ message: "Menu item added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding menu item", error });
    }
});

// Update menu item
router.put("/update/:id", async (req, res) => {
    try {
        await MenuItem.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Menu item updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating menu item", error });
    }
});

// Delete menu item
router.delete("/delete/:id", async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting menu item", error });
    }
});

module.exports = router;
