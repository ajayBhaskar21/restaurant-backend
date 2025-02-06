require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Import menu routes
const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menu", menuRoutes);

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
const Admin = mongoose.model("Admin", adminSchema);

// Manually insert admin credentials (One-time operation)
const insertAdmin = async () => {
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
        // Use environment variables to store sensitive information
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await Admin.create({ username: "admin", password: hashedPassword });
        console.log("Admin account created");
    }
};
insertAdmin();

// Login Route
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// Middleware for Protected Routes
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "Access Denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
